import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getUserOrgs } from '../lib/data';

import { Link, Router } from '../routes';

import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import Upload from '../components/Upload';
import Footer from '../components/Footer';

export default class Index extends Component {

  static async getInitialProps ({ req }) {
    const initialProps = {};

    let accessToken;
    if (req) {
      accessToken = get(req, 'session.passport.user.accessToken');
    } else if (typeof window !== 'undefined') {
      accessToken = get(window, '__NEXT_DATA__.props.pageProps.loggedInUser.accessToken');
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

  render () {
    const { pathname, loggedInUser, loggedInUserOrgs } = this.props;

    return (
      <div className="Page IndexPage">

        <style jsx global>{`
        @media screen and (max-width:500px) {
          .IndexPage {
            padding: 20px;
          }
          .IndexPage header {
            display: none !important;
          }
        }
        `}
        </style>

        <style jsx>{`
          h1 {
            width: 220px;
            margin: 0 auto 50px;
            padding: 0;
          }
          h1 img {
            width: 220px;
            height: 128px;
          }

          .search, .description, .uploadDescription, .uploadContainer {
            margin: auto;
          }

          p {
            text-align: center;
            color: #9399A3;
          }

          .description {
            color: #2E3033;
            font-size: 14px;
            font-weight: 500;
            line-height: 22px;
          }
          .uploadDescription {
            font-size: 12px;
            line-height: 18px;
          }

          .search {
            width: 450px;
          }
          .description {
            width: 340px;
          }
          .uploadDescription {
            width: 450px;
          }
          .uploadContainer {
            margin-top: 50px;
            width: 400px;
            margin-bottom: 50px;
          }

          .uploadDescription.desktop {
            display: block;
          }
          .uploadDescription.mobile {
            display: none;
          }

          @media screen and (max-width:500px) {
            h1 {
              margin-bottom: 25px;
            }
            .search {
              width: auto;
            }
            .description {
              width: 250px;
            }
            .uploadDescription {
              width: auto;
            }
            .uploadDescription.desktop {
              display: none;
            }
            .uploadDescription.mobile {
              display: block;
            }
            .uploadContainer {
              display: none;
            }
          }
        `}
        </style>

        <Header pathname={pathname} loggedInUser={loggedInUser} brand={false} />

        <div className="homepage">

          <h1>
            <Link route="index">
              <a>
                <img src="/static/img/logo-bys-homepage.png" alt="BackYourStack" />
              </a>
            </Link>
          </h1>

          <p className="description">
            Discover the open source projects your organization
            is using that need financial support.
          </p>

          <div className="search">
            <SearchForm orgs={loggedInUserOrgs} />
          </div>

          <p className="uploadDescription desktop">
            If you want to analyze non-public repositories,
            {' '}
            <Link route="login" params={{ next: pathname || '/' }}>
              <a>sign in with your GitHub account</a>
            </Link>
            {' '}
            or simply upload <em>package.json</em> and <em>composer.json</em> files.
            The uploaded files will not be shared with anyone
            and will be deleted when your session expire.
          </p>

          <p className="uploadDescription mobile">
            If you want to analyze non-public repositories,
            {' '}
            <Link route="login" params={{ next: pathname || '/' }}>
              <a>sign in with your GitHub account</a>
            </Link>
            {' '}
            You can also simply upload <em>package.json</em>, <em>composer.json</em>, <em>*.csproj</em> or <em>packages.config</em> files, use a desktop browser for that.
          </p>

          <div className="uploadContainer">
            <Upload
              onUpload={this.onUpload}
              feedbackPosition="float"
              style={{ height: '125px' }}
              />
          </div>

        </div>

        <Footer />

      </div>
    );
  }

}
