import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { fetchJson } from '../lib/fetch';

import Header from '../components/Header';
import Footer from '../components/Footer';

const EXAMPLE_VALUE = 200;
const EXAMPLE_FEES = 0.15;

const getFilesData = sessionFiles =>
  process.env.IS_CLIENT
    ? fetchJson('/data/getFilesData')
    : import('../lib/data').then(m => m.getFilesData(sessionFiles));

export default class MonthlyPlan extends React.Component {
  static async getInitialProps({ req, query }) {
    const uuid = query.uuid; // handle case where the uuid is not supplied

    let protocol = 'https:';
    const host = req ? req.headers.host : window.location.host;
    if (host.indexOf('localhost') > -1) {
      protocol = 'http:';
    }
    const baseUrl = `${protocol}//${host}`;

    // sessionFiles is optional and can be null (always on the client)
    const sessionFiles = get(req, 'session.files');
    const { recommendations } = await getFilesData(sessionFiles);

    return {
      uuid,
      baseUrl,
      recommendations,
      next: query.next || '/',
    };
  }

  static propTypes = {
    uuid: PropTypes.string,
    baseUrl: PropTypes.string,
    loggedInUser: PropTypes.object,
    recommendations: PropTypes.array,
  };

  getContributionUrl = () => {
    // Get the key url of the file
    const { baseUrl, uuid } = this.props;
    if (uuid) {
      const jsonUrl = `${baseUrl}/${uuid}/file/backing.json`;
      const data = JSON.stringify({ jsonUrl });
      const redirect = `${baseUrl}/monthly-plan/confirmation`;
      const searchParams = new URLSearchParams({ data, redirect });
      const opencollectiveRedirectUrl = `${process.env.OPENCOLLECTIVE_BASE_URL}${process.env.OPENCOLLECTIVE_REDIRECT_PATH}`;
      return `${opencollectiveRedirectUrl}?${searchParams}`;
    }
  };

  render() {
    const { loggedInUser, recommendations } = this.props;

    const opencollectiveRecommendations = recommendations
      .filter(r => r.opencollective)
      .filter(r => r.opencollective.pledge !== true);

    const dispatchedValue = EXAMPLE_VALUE * (1 - EXAMPLE_FEES);
    const singleValue = (
      dispatchedValue / opencollectiveRecommendations.length
    ).toFixed(2);

    return (
      <Fragment>
        <div className="Page BackMyStackPage">
          <style jsx>
            {`
              .content {
                width: 540px;
                border: 1px solid #dcdcdd;
                border-radius: 12px;
                margin: 50px auto;
                padding: 20px 30px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table th,
              table td {
                border: 1px solid #c1c6cc;
                padding: 0.5em;
                white-space: nowrap;
                font-size: 12px;
                color: #121314;
              }
              .continueButton {
                width: 200px;
                margin: 50px auto 20px;
              }
              @media screen and (max-width: 640px) {
                .content {
                  width: auto;
                  padding: 20px 15px;
                  margin: 50px 20px;
                }
              }
            `}
          </style>
          <Header loggedInUser={loggedInUser} login={false} brandAlign="auto" />
          <div className="content">
            <p>Congratulations, you&apos;re about to Back Your Stack!</p>
            <p>
              You&apos;ll make a single monthly payment and we&apos;ll
              distribute the funds to your detected dependencies below. If new
              dependencies join in the future, they will be detected and added
              the following month. Your subscription will not change, we&apos;ll
              distribute it amongst more dependencies You can always update the
              amount.
            </p>
            <p>
              <strong>Example</strong>: you decide to give ${EXAMPLE_VALUE}{' '}
              within the monthly plan.
            </p>
            <table>
              <tr>
                <th>Collective</th>
                <th>Amount</th>
              </tr>
              {recommendations
                .filter(r => r.opencollective)
                .filter(r => r.opencollective.pledge !== true)
                .map(recommendation => (
                  <tr key={recommendation.name}>
                    <td>
                      <a
                        href={`${process.env.OPENCOLLECTIVE_BASE_URL}/${recommendation.opencollective.slug}`}
                      >
                        {recommendation.opencollective.name}
                      </a>
                    </td>
                    <td>
                      ${singleValue} <sup>*</sup>
                    </td>
                  </tr>
                ))}
            </table>
            <p>* May vary slightly depending on payment processor fees.</p>
            <a
              className="button bigButton continueButton"
              href={`${this.getContributionUrl()}`}
            >
              Continue on Open Collective
            </a>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}
