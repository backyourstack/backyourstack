import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default class BackMyStack extends React.Component {
  static getInitialProps({ req, query }) {
    const uuid = query.uuid; // handle case where the uuid is not supplied
    const openCollectiveRedirectUrl = process.env.OPENCOLLECTIVE_REDIRECT_URL;

    let protocol = 'https:';
    const host = req ? req.headers.host : window.location.hostname;
    if (host.indexOf('localhost') > -1) {
      protocol = 'http:';
    }
    const baseUrl = `${protocol}//${host}`;

    return {
      uuid,
      baseUrl,
      openCollectiveRedirectUrl,
      next: query.next || '/',
    };
  }

  static propTypes = {
    uuid: PropTypes.string,
    baseUrl: PropTypes.string,
    openCollectiveRedirectUrl: PropTypes.string,
    loggedInUser: PropTypes.object,
  };

  getContributionUrl = () => {
    // Get the key url of the file
    const { openCollectiveRedirectUrl, baseUrl, uuid } = this.props;
    if (uuid) {
      const jsonUrl = `${baseUrl}/${uuid}/file/backing.json`;
      const data = JSON.stringify({
        jsonUrl,
      });
      const redirect = `${baseUrl}/confirm`;
      const searchParams = new URLSearchParams({ data, redirect });
      const contributionUrl = `${openCollectiveRedirectUrl}?${searchParams}`;
      return contributionUrl;
    }
  };

  render() {
    return (
      <Fragment>
        <div className="Page BackMyStackPage">
          <style jsx>
            {`
              .content {
                display: flex;
                justify-content: center;
                width: 540px;
                border: 1px solid #dcdcdd;
                border-radius: 12px;
                margin: 50px auto;
                padding: 20px 30px;
              }
              .backMyStackInfoWrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 400px;
                margin-top: 60px;
              }
              .backMyStackInfoWrapper p {
                font-size: 1.5rem;
                text-align: center;
              }
              .continueBtn {
                margin: 10px;
                cursor: pointer;
                font-size: 1.5rem;
                padding: 16px;
                outline: none;
                border: 1px solid #dcdee0;
                border-radius: 10px;
                background: #3f00a5;
                color: #fff;
                text-decoration: none;
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
          <Header
            loggedInUser={this.props.loggedInUser}
            login={false}
            brandAlign="auto"
          />
          <div className="content">
            <div className="backMyStackInfoWrapper">
              <p>
                You&apos;re about to back your entier stack, donations will be
                shared every month amongst your stack collectives registerd on
                Open Collective.
              </p>
              <a className="continueBtn" href={`${this.getContributionUrl()}`}>
                Continue
              </a>
            </div>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}
