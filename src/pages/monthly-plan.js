import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import NumberFormat from 'react-number-format';
import { get, map, pick } from 'lodash';

import { fetchJson, postJson } from '../lib/fetch';

import Header from '../components/Header';
import Footer from '../components/Footer';
import UpArrow from '../static/img/up-arrow.svg';
import DownArrow from '../static/img/down-arrow.svg';

const suggestedAmounts = [
  {
    id: 1,
    employeeRange: '1-10',
    totalAmount: 100,
    frequency: 'month',
    currency: 'USD',
    currencySymbol: '$',
  },
  {
    id: 2,
    employeeRange: '10-100',
    totalAmount: 1000,
    frequency: 'month',
    currency: 'USD',
    currencySymbol: '$',
  },
  {
    id: 3,
    employeeRange: '100-1000',
    totalAmount: 5000,
    frequency: 'month',
    currency: 'USD',
    currencySymbol: '$',
  },
  {
    id: 4,
    employeeRange: '1000-5000',
    totalAmount: 10000,
    frequency: 'month',
    currency: 'USD',
    currencySymbol: '$',
  },
  {
    id: 'more',
  },
  {
    id: 'custom',
  },
];

const getProfileData = (id, accessToken, excludedRepos) => {
  const params = { id };
  if (excludedRepos) {
    params.excludedRepos = excludedRepos;
  }
  const searchParams = new URLSearchParams(params);
  return process.env.IS_CLIENT
    ? fetchJson(`/data/getProfileData?${searchParams}`)
    : import('../lib/data').then(m =>
        m.getProfileData(id, accessToken, { excludedRepos }),
      );
};

const getFilesData = sessionFiles =>
  process.env.IS_CLIENT
    ? fetchJson('/data/getFilesData')
    : import('../lib/data').then(m => m.getFilesData(sessionFiles));

export default class MonthlyPlan extends React.Component {
  static async getInitialProps({ req, query }) {
    const id = query.id;
    const type = query.type;

    let protocol = 'https:';
    const host = req ? req.headers.host : window.location.host;
    if (host.indexOf('localhost') > -1) {
      protocol = 'http:';
    }
    const baseUrl = `${protocol}//${host}`;
    const excludedRepos = query.excludedRepos || [];
    let recommendations = [];
    if (type === 'file') {
      // sessionFiles is optional and can be null (always on the client)
      const sessionFiles = get(req, 'session.files');
      const data = await getFilesData(sessionFiles);
      recommendations = data.recommendations;
    } else if (type === 'profile') {
      // The accessToken is only required server side (it's ok if it's undefined on client side)
      const accessToken = get(req, 'session.passport.user.accessToken');
      const data = await getProfileData(query.id, accessToken, excludedRepos);
      recommendations = data.recommendations;
    }

    return {
      id,
      baseUrl,
      recommendations,
      type,
      excludedRepos,
      next: query.next || '/',
    };
  }

  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    baseUrl: PropTypes.string,
    loggedInUser: PropTypes.object,
    recommendations: PropTypes.array,
    excludedRepos: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedAmount: suggestedAmounts[2], // set default selected amount
      customAmount: '',
      mobileToggleExpanded: true,
      showCustomAmount: true,
      recommendations:
        this.getActiveCollectiveRecommendations(props.recommendations) || [],
    };
  }

  componentDidMount() {
    const isMobile = window.innerWidth <= 640;

    // amountList should not be expanded by default in mobile view
    if (isMobile) {
      this.setState({
        mobileToggleExpanded: false,
      });
    }
  }

  getContributionUrlData() {
    const { type, baseUrl, id, excludedRepos } = this.props;
    let jsonUrl =
      type === 'file'
        ? `${baseUrl}/${id}/file/backing.json`
        : `${baseUrl}/${id}/profile/backing.json`;

    if (type === 'profile' && excludedRepos.length !== 0) {
      jsonUrl = `${jsonUrl}?excludedRepos=${JSON.stringify(excludedRepos)}`;
    }

    return { jsonUrl };
  }

  getActiveCollectiveRecommendations(recommendations) {
    const opencollectiveRecommendations = recommendations
      .filter(r => r.opencollective)
      .filter(r => r.opencollective.pledge !== true)
      .map(r => {
        r.checked = true;
        return r;
      });
    return opencollectiveRecommendations;
  }

  getContributionUrl = () => {
    // Get the key url of the file
    const { baseUrl, id } = this.props;
    if (id) {
      const searchParams = new URLSearchParams({
        data: JSON.stringify(this.getContributionUrlData()),
        redirect: `${baseUrl}/monthly-plan/confirmation`,
        amount: this.getTotalAmount(),
        skipStepDetails: 'true',
      });
      const opencollectiveRedirectUrl = `${process.env.OPENCOLLECTIVE_BASE_URL}${process.env.OPENCOLLECTIVE_REDIRECT_PATH}`;
      return `${opencollectiveRedirectUrl}?${searchParams}`;
    }
  };

  getSelectedDependencies() {
    const { recommendations } = this.state;
    const selectedDependencies = recommendations.filter(r => r.checked);
    // The recommended collectives are all selected by default
    // we're checking if the user made any changes so we can keep track
    // of the selected collectives.
    if (selectedDependencies.length !== recommendations.length) {
      return map(selectedDependencies, dependency => {
        const { opencollective, github } = dependency;
        return {
          weight: 100,
          opencollective: pick(opencollective, ['id', 'name', 'slug']),
          github: github,
        };
      });
    }
    return null;
  }

  async saveSelectedDependencies() {
    const selectedDependencies = this.getSelectedDependencies();
    const { id } = this.props;
    if (selectedDependencies) {
      try {
        await postJson('/selectedDependencies/save', {
          id,
          selectedDependencies,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  handleAmountChange = event => {
    const customAmount = event.target.value;
    this.setState({
      customAmount: parseInt(customAmount),
    });
  };

  handleOnAmountSelect = selectedAmount => {
    this.setState({
      selectedAmount,
      disableContributionLink: false,
    });
  };

  handleDependencySelection = ({ target }) => {
    let { recommendations } = this.state;
    const name = target.name;
    const checked = target.checked;
    recommendations = recommendations.map(r => {
      if (r.name === name) {
        r.checked = checked;
      }
      return r;
    });

    this.setState({
      recommendations,
    });
  };

  hanldeAmountSuggestionToggle = () => {
    const { mobileToggleExpanded } = this.state;
    this.setState({
      mobileToggleExpanded: !mobileToggleExpanded,
    });
  };

  getTotalAmount() {
    const { selectedAmount, customAmount } = this.state;
    if (selectedAmount && selectedAmount.id === 'custom' && customAmount) {
      return customAmount;
    } else if (selectedAmount && selectedAmount.totalAmount) {
      return selectedAmount.totalAmount;
    } else {
      return 0;
    }
  }

  renderFormattedAmount(amount, currencySymbol) {
    return (
      <NumberFormat
        value={amount}
        displayType={'text'}
        thousandSeparator={true}
        prefix={currencySymbol}
      />
    );
  }

  renderCustomAmountCard(suggestedAmount) {
    const { customAmount, selectedAmount } = this.state;

    return (
      <div
        key={suggestedAmount.id}
        className={classnames('amountCard', 'customAmountCard', {
          selectedAmountCard: selectedAmount.id === 'custom',
        })}
        onClick={() => this.handleOnAmountSelect(suggestedAmount)}
      >
        <p className="customAmountText">Custom Amount</p>
        <div className="customAmountInput">
          <div className="prepend">$</div>
          <input
            type="number"
            className="amountInput"
            name="totalAmount"
            placeholder="1000 / month"
            value={customAmount}
            onChange={this.handleAmountChange}
          />
        </div>
      </div>
    );
  }

  renderSuggestedAmount() {
    const { selectedAmount, mobileToggleExpanded } = this.state;
    let suggestedAmountsToShow;

    // For mobile view
    if (mobileToggleExpanded) {
      suggestedAmountsToShow = suggestedAmounts;
    } else {
      // Only render one of the suggested amounts in mobile view
      // if `mobileToggleExpanded` is false
      suggestedAmountsToShow = [suggestedAmounts[0]];
    }

    return (
      <Fragment>
        <style>
          {`
              .amountList {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
                width: 80%;
              }
              .amountCard {
                width: 250px;
                min-height: 80px;
                margin-right: 20px;
                border: 1px solid #6F5AFA;
                border-radius: 6px;
                background: #fff;
                text-align: center;
                box-sizing: border-box;
                padding: 5px;
                cursor: pointer;
                color: #141414;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .moreCard a {
                background: #2C2C85;
                color: #fff;
                border: none;
                white-space: nowrap;
                padding: 10px;
                margin-top: 10px;
              }
              .moreCard a:hover {
                color: #fff;
              }
              .selectedAmountCard p {
                color: #fff;
              }
              .customAmountText,
              .employeeRange,
              .employeeText {
                margin: 0;
              }
              .customAmountText,
              .employeeRange {
                font-weight: bold;
                font-size: 14px;
                line-height: 22px;
                letter-spacing: -0.2px;
                line-height: 22px;
              }
              .employeeText {
                font-weight: 600;
                font-size: 12px;
                line-height: 18px;
                color: #9D9FA3;
                margin-bottom: 10px;
              }
              .selectedAmountCard,
              .amountCard:hover:not(.mobileSuggestedAmountToggle) {
                border: 1px solid #6F5AFA;
                background: #6F5AFA;
                color: #fff;
              }
              .amountCard:hover .employeeText {
                color: #fff;                
              }
              .amountFigWrapper {
                display: flex;
                align-items: baseline;
              }
              .amountFig {
                font-weight: bold;
                font-size: 16px;
                line-height: 24px;
                margin-right: 5px;
              }
              .currencyAndFreq {
                font-weight: 400;
                font-size: 11px;
                white-space: nowrap;
              }
              .customAmountCard {
                padding: 10px;
              }
              .customAmountInput {
                height: 40px;
                border: 1px solid #C4C7CC;
                box-shadow: inset 0px 2px 2px rgba(20, 20, 20, 0.08);
                border-radius: 8px;
                width: 130px;
                display: flex;
                align-items: center;
                background: #fff;
              }
              .amountInput {
                font-size: 14px;
                line-height: 24px;
                width: 80%;
                border: none;
                outline: none;
                padding: 5px;
              }
              .amountInput::placeholder {
                color: #9D9FA3;
                font-size: 12px;
              }
              .prepend {
                width: 20%;
                background: #F5F7FA;
                font-size: 14px;
                line-height: 22px;
                height: 99%;
                border: none;
                display: flex;
                align-items: center;
                color: #C0C5CC;
                justify-content: space-around;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
              }
              .mobileSuggestedAmountToggle {
                display: none;
              }
              @media screen and (max-width: 768px) {
                .amountList {
                  margin-left: 10px;
                }
                .amountCard {
                  margin-right: 8px;
                }
                .moreCard {
                  padding: 5px;
                }
              }
              @media screen and (max-width: 640px) {
                .customAmountCard {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                }
                .amountList {
                  flex-direction: column;
                  width: 100%;
                  position: relative;
                }
                .amountCard {
                  width: 100%;
                }
                .customAmountInput {
                  width: 200px;
                }
                .amountInput::placeholder {
                  color: #9D9FA3;
                  font-size: 14px;
                }
                .amountCard:not(.mobileSuggestedAmountToggle) {
                  border-bottom: none;
                  border-bottom-left-radius: 0;
                  border-bottom-right-radius: 0;
                }
                .amountCard:not(:first-child) {
                  border-top-left-radius: 0;
                  border-top-right-radius: 0;
                }
                .mobileSuggestedAmountToggle {
                  display: flex;
                  min-height: 33px;
                  align-items: center;
                  justify-content: center;
                }
              }
          `}
        </style>
        <div className="amountList">
          {suggestedAmountsToShow.map(suggestedAmount => {
            const selectedAmountCard = selectedAmount
              ? selectedAmount.id === suggestedAmount.id
              : false;
            if (suggestedAmount.id === 'more') {
              return (
                <div className="amountCard moreCard" key={suggestedAmount.id}>
                  <p className="customAmountText">More?</p>
                  <a href="mailto:hello@opencollective.com" className="button">
                    Contact Us
                  </a>
                </div>
              );
            } else if (suggestedAmount.id === 'custom') {
              return this.renderCustomAmountCard(suggestedAmount);
            } else {
              return (
                <div
                  key={suggestedAmount.id}
                  className={classnames('amountCard', { selectedAmountCard })}
                  onClick={() => this.handleOnAmountSelect(suggestedAmount)}
                >
                  <p className="employeeRange">
                    {suggestedAmount.employeeRange}
                  </p>
                  <p className="employeeText">Employees</p>
                  <div className="amountFigWrapper">
                    <span className="amountFig">
                      {this.renderFormattedAmount(
                        suggestedAmount.totalAmount,
                        suggestedAmount.currencySymbol,
                      )}
                    </span>{' '}
                    <span className="currencyAndFreq">
                      / {suggestedAmount.frequency}
                    </span>
                  </div>
                </div>
              );
            }
          })}
          <div
            className="amountCard mobileSuggestedAmountToggle"
            onClick={this.hanldeAmountSuggestionToggle}
          >
            {mobileToggleExpanded ? (
              <div className="arrowIconWrapper">
                <UpArrow />
              </div>
            ) : (
              <div className="arrowIconWrapper">
                <DownArrow />
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const { loggedInUser } = this.props;
    const { recommendations } = this.state;
    const totalAmount = this.getTotalAmount();
    const disableContributionLink = totalAmount === 0;
    const dispatchedValue = totalAmount;
    const selectedCollectives = recommendations.filter(r => r.checked === true);
    const singleValue = (dispatchedValue / selectedCollectives.length).toFixed(
      2,
    );

    return (
      <Fragment>
        <div className="Page BackMyStackPage">
          <style jsx>
            {`
              .mainWrapper {
                background: url(/static/img/background-colors.svg) no-repeat;
                margin: 0;
                padding: 20px;
              }
              .contentWrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                wdith: 100%;
                box-sizing: border-box;
              }
              .content {
                width: 540px;
                border-radius: 12px;
                margin-top: 15px;
                padding: 20px 30px;
                color: #141414;
              }
              .content h1 {
                font-size: 32px;
                line-height: 36px;
                letter-spacing: -0.4px;
              }
              .content h4 {
                font-size: 20px;
                line-height: 22px;
                letter-spacing: -0.2px;
              }
              .content p {
                font-size: 14px;
                line-height: 22px;
                letter-spacing: -0.2px;
              }
              .content h5 {
                font-size: 16px;
                line-height: 24px;
                margin-bottom: 10px;
              }
              .amountTableWrapper {
                background: #fff;
                border: 1px solid rgba(24, 26, 31, 0.1);
                border-radius: 8px;
                color: #76777a;
                padding: 20px;
              }
              .tableDescription {
                font-size: 14px;
                font-weight: 400;
              }
              table {
                border-collapse: collapse;
              }
              table th,
              table tr {
                border-bottom: 1px solid #dcdee0;
                white-space: nowrap;
                font-size: 14px;
              }
              table th,
              table td {
                padding-top: 5px;
                padding-bottom: 5px;
              }
              .checkbox {
                border: 1px solid #c4c7cc;
                box-shadow: inset 0px 2px 2px rgba(20, 20, 20, 0.08);
                border-radius: 3px;
              }
              table tr th:nth-child(1),
              table tr td:nth-child(1) {
                width: 10%;
              }
              table tr th:nth-child(3),
              table tr td:nth-child(3) {
                text-align: right;
              }
              table tr th:nth-child(2),
              table tr td:nth-child(2) {
                text-align: left;
                width: 95%;
              }
              table th {
                text-transform: uppercase;
                font-weight: bold;
                font-size: 10px;
              }
              .collectiveColumn {
                display: flex;
                flex-direction: column;
                width: 120%;
              }
              .collectiveColumn a {
                line-height: 1.9;
              }
              .collectiveDescription {
                white-space: normal;
                font-size: 11px;
                font-style: italic;
                margin-bottom: 10px;
              }
              .continueButton {
                width: 200px;
                margin: 50px auto 20px;
                background: #3a2fac;
              }
              .continueButton:hover {
                background: #3a2fac;
                opacity: 0.8;
              }
              .notice-p {
                font-size: 12px;
                font-weight: 300;
              }
              .continue-p {
                font-size: 12px;
                text-align: center;
              }
              .disableContributionLink {
                pointer-events: none;
                cursor: default;
                opacity: 0.5;
              }
              @media screen and (max-width: 640px) {
                .mainWrapper {
                  background: url(/static/img/mobile-background-colors.svg)
                    no-repeat;
                  background-size: 100%;
                }
                .content {
                  width: 90%;
                  position: relative;
                }
                .topContent {
                  width: 100%;
                }
                .amountTableWrapper {
                  margin: 10px 50px;
                }
              }
            `}
          </style>
          <Header loggedInUser={loggedInUser} login={false} brandAlign="auto" />
          <div className="mainWrapper">
            <div className="contentWrapper">
              <div className="content topContent">
                <h1>Congratulations 🎉</h1>
                <h4>You&apos;re about to Back Your Stack!</h4>
                <p>
                  You&apos;ll make a single monthly payment and we&apos;ll
                  distribute the funds to your detected dependencies below. If
                  new dependencies join in the future, they will be detected and
                  added the following month. Your subscription will not change,
                  we&apos;ll distribute it amongst more dependencies You can
                  always update the amount.
                </p>
                <h5>Back your stack membership</h5>
                <p>
                  Please select the membership you want to set as a monthly due,
                  or use the custom field to select a different amount to
                  contribute.
                </p>
              </div>
              {this.renderSuggestedAmount()}
              <div className="content amountTableWrapper">
                <p className="tableDescription">
                  You decided to give{' '}
                  <strong>
                    {this.renderFormattedAmount(totalAmount, '$')}
                  </strong>{' '}
                  within the <strong>monthly plan.</strong>
                </p>
                <table>
                  <tr>
                    <th></th>
                    <th>Collective</th>
                    <th>Amount</th>
                  </tr>
                  {recommendations.map(recommendation => (
                    <tr key={recommendation.name}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={event =>
                            this.handleDependencySelection(event)
                          }
                          name={recommendation.name}
                          checked={recommendation.checked}
                        />
                      </td>
                      <td className="collectiveColumn">
                        <a
                          href={`${process.env.OPENCOLLECTIVE_BASE_URL}/${recommendation.opencollective.slug}`}
                        >
                          {recommendation.opencollective.name}
                        </a>{' '}
                        <span className="collectiveDescription">
                          {recommendation.opencollective.description}
                        </span>
                      </td>
                      <td className="sharableAmount">
                        ${singleValue} <sup>*</sup>
                      </td>
                    </tr>
                  ))}
                </table>
                <p className="notice-p">
                  * Final amount distributed may vary slightly depending on
                  payment processor fees.
                </p>
                <a
                  className={classnames('button bigButton continueButton', {
                    disableContributionLink,
                  })}
                  onClick={() => this.saveSelectedDependencies()}
                  href={`${this.getContributionUrl()}`}
                >
                  Continue on Open Collective
                </a>
                <p className="continue-p">
                  The rest of the back your stack process continues at{' '}
                  <strong>opencollective.com</strong>
                </p>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </Fragment>
    );
  }
}
