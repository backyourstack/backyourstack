import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { fetchJson } from '../lib/fetch';
import supportedFiles from '../lib/dependencies/supported-files';

import { Link, Router } from '../routes';

import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import Upload from '../components/Upload';
import Footer from '../components/Footer';
import GithubLogo from '../static/img/icon-github.svg';
import UploadIcon from '../static/img/upload-icon.svg';

const getUserOrgs = (accessToken) =>
  process.env.IS_CLIENT
    ? fetchJson('/data/getUserOrgs')
    : import('../lib/data').then((m) => m.getUserOrgs(accessToken));

export default class Index extends Component {
  static async getInitialProps({ req }) {
    const initialProps = {};

    let accessToken;
    if (req) {
      accessToken = get(req, 'session.passport.user.accessToken');
    } else if (typeof window !== 'undefined') {
      accessToken = get(
        window,
        '__NEXT_DATA__.props.pageProps.loggedInUser.accessToken',
      );
    }
    if (accessToken) {
      initialProps.loggedInUserOrgs = await getUserOrgs(accessToken);
    }

    return initialProps;
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    loggedInUserOrgs: PropTypes.array,
  };

  onUpload = () => {
    Router.pushRoute('files');
  };

  render() {
    const { pathname, loggedInUser, loggedInUserOrgs } = this.props;

    const supportedFilesAsComponent = supportedFiles
      .map((file) => <em key={file}>{file}</em>)
      .reduce((acc, curr, idx, src) => {
        if (idx === 0) {
          return [curr];
        } else if (src.length - 1 === idx) {
          return [...acc, ' and ', curr];
        } else {
          return [...acc, ', ', curr];
        }
      }, []);

    return (
      <div className="Page IndexPage">
        <style jsx global>
          {`
            @media screen and (max-width: 500px) {
              .homepage {
                padding: 20px;
              }
            }
          `}
        </style>

        <style jsx>
          {`
            h1 {
              width: 220px;
              margin: 0 auto 25px;
              padding: 0;
            }

            p {
              text-align: center;
              color: #9399a3;
            }
            .background {
              background: url(/static/img/background-colors.svg);
              background-repeat: no-repeat;
              position: absolute;
              height: 100%;
              width: 100%;
              opacity: 0.65;
              z-index: -1;
              right: 0;
            }
            .homepage {
              display: flex;
              flex-direction: column;
              width: 100%;
              align-items: center;
              box-sizing: border-box;
            }
            .description {
              color: #141414;
              font-weight: 800;
              font-size: 32px;
              line-height: 40px;
              text-align: center;
              width: 55%;
              letter-spacing: -0.4px;
              margin: 60px 20px 20px;
            }
            .asterisk {
              color: #180c66;
            }
            .secondaryDescription {
              font-size: 12px;
              color: #4e5052;
              line-height: 18px;
              font-weight: 200;
              width: 45%;
            }
            .seeHowLink {
              text-decoration: none;
              color: #7042ff;
            }
            .optionsDescription {
              font-weight: 400;
              font-size: 16px;
              line-height: 24px;
              color: #4e5052;
              width: 50%;
            }
            .boxWrapper {
              width: 100%;
              display: flex;
              justify-content: center;
              margin-bottom: 20px;
              box-sizing: border-box;
            }
            .box {
              width: 450px;
              display: flex;
              flex-direction: column;
              min-height: 340px;
              background: #fff;
              border: 1px solid rgba(24, 26, 31, 0.1);
              border-radius: 8px;
              margin: 20px;
              padding: 10px 20px;
              box-sizing: border-box;
            }
            .boxHeader {
              display: flex;
              align-items: baseline;
              color: #4e5052;
              font-size: 16px;
              line-height: 24px;
            }
            .icon {
              margin-right: 20px;
              width: 16px;
              height: 16px;
            }
            .boxDescription {
              text-align: left;
              font-size: 14px;
              line-height: 22px;
              color: #76777a;
              letter-spacing: -0.2px;
            }
            .uploadContainer {
              width: 280px;
              align-self: center;
            }
            @media screen and (min-width: 1450px) {
              .description {
                width: 784px;
              }
              .secondaryDescription,
              .optionsDescription {
                width: 700px;
              }
            }
            @media screen and (max-width: 500px) {
              h1 {
                margin-bottom: 25px;
              }
              .background {
                background: url(/static/img/mobile-background-colors.svg);
                opacity: 1;
              }
              .description {
                width: 100%;
              }
              .description,
              .secondaryDescription,
              .optionsDescription,
              .uploadContainer {
                width: 80%;
              }
              .boxWrapper {
                flex-direction: column;
                align-items: center;
              }
              .box {
                width: 100%;
              }
            }
          `}
        </style>

        <Header pathname={pathname} loggedInUser={loggedInUser} />
        <div className="background"></div>
        <div className="homepage">
          <h1 className="description">
            Discover the Open Source projects
            <small className="asterisk">
              <sup>*</sup>
            </small>{' '}
            your organization is using that need financial support.
          </h1>
          <p className="secondaryDescription">
            <span className="asterisk">*</span> We currently detect dependencies
            from JavaScript (NPM), PHP (Composer), .NET (Nuget), Go (dep), Ruby
            (Gem) and Python (Requirement). Want to see more languages? Please{' '}
            <Link route="contributing">
              <a className="seeHowLink">see how to contribute</a>
            </Link>
            .
          </p>
          <p className="optionsDescription">
            Use one of the two options below to scan your organization&apos;s
            code and find out which of your dependencies are seeking funding.
            You can now support them!
          </p>
          <div className="boxWrapper">
            <div className="box">
              <div className="boxHeader">
                <div className="icon">
                  <GithubLogo />
                </div>
                <h3>Use a GitHub profile</h3>
              </div>
              <p className="boxDescription">
                Enter any GitHub organization or identifier, and we'll find its
                dependencies! You must be signed in with GitHub (see the NavBar)
                for this to work, or for us to access your private repositories.
              </p>
              <SearchForm orgs={loggedInUserOrgs} />
            </div>
            <div className="box">
              <div className="boxHeader">
                <div className="icon">
                  <UploadIcon />
                </div>
                <h3>Upload dependency files</h3>
              </div>
              <p className="boxDescription">
                If you want to analyze private or local repositories simply
                upload dependency files. At the moment, we support{' '}
                {supportedFilesAsComponent}.
              </p>
              <div className="uploadContainer">
                <Upload
                  onUpload={this.onUpload}
                  feedbackPosition="float"
                  style={{ height: '75px' }}
                />
              </div>
              <p className="boxDescription">
                The uploaded files will not be shared and we will store them
                only with your explicit consent.
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
