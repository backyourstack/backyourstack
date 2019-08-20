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
    const id = query.Id;

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
      id,
      baseUrl,
      recommendations,
      next: query.next || '/',
    };
  }

  static propTypes = {
    id: PropTypes.string,
    baseUrl: PropTypes.string,
    loggedInUser: PropTypes.object,
    recommendations: PropTypes.array,
  };

  getContributionUrl = () => {
    // Get the key url of the file
    const { baseUrl, id } = this.props;
    if (id) {
      const jsonUrl = `${baseUrl}/${id}/file/backing.json`;
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
            <h3>Brilliant!</h3>
            <p>
              You&apos;re about to subscribe to the BackYourStack monthly plan
              on Open Collective.
            </p>
            <p>
              Each month, you will be charged once by BackYourStack through Open
              Collective. The money will then be dispatched equally between all
              detected dependencies.
            </p>
            <p>
              If new dependencies are joining Open Collective, they will be
              detected and taking care of in the next monthly dispatch.
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
            <p>
              * Estimation, final value may be slightly different depending of
              payment processor fees.
            </p>
            <p>Sounds good?</p>
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
