import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getUserOrgs, getFilesData } from '../lib/data';

import { Link, Router } from '../routes';

import Header from '../components/Header';
import Content from '../components/Content';
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

    // sessionFiles is optional and can be null (always on the client)
    const sessionFiles = get(req, 'session.files');
    const { files } = await getFilesData(sessionFiles);

    return { files, ... initialProps };
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    loggedInUserOrgs: PropTypes.array,
    files: PropTypes.object,
  };

  static defaultProps = {
    files: {},
  };

  constructor (props) {
    super(props);
    this.state = { files: props.files };
  }

  onUpload = () => {
    Router.pushRoute('files');
  };

  refresh = async () => {
    const { files } = await getFilesData();

    this.setState({ files });
  };

  render () {
    const { pathname, loggedInUser, loggedInUserOrgs } = this.props;

    const { files } = this.state;
    return (
      <div className="Page IndexPage">

        <style jsx global>{`
        .IndexPage {
          width: 1152px;
        }
        `}
        </style>

        <style jsx>{`
          h1 {
            width: 244px;
            margin: 0 auto 50px;
            padding: 0;
          }
          h1 img {
            width: 244px;
            height: 155px;
            display: block;
          }
          .homepage p, .homepage .search {
            margin: auto;
            width: 450px;
          }
          .homepage p {
            text-align: center;
            color: #9399A3;
          }
          .uploadDescription {
            font-size: 12px;
            line-height: 18px;
          }
          .uploadContainer {
            margin: 50px auto;
            width: 400px;
          }
        `}
        </style>

        <Header pathname={pathname} loggedInUser={loggedInUser} brand={false} />

        <Content>

          <div className="homepage">

            <h1>
              <Link route="index">
                <a>
                  <img src="/static/img/logo.jpg" alt="Back Your Stack" />
                </a>
              </Link>
            </h1>

            <p>
              Discover the open source projects you are using<br />
              and need financial support.
            </p>

            <div className="search">
              <SearchForm orgs={loggedInUserOrgs} />
            </div>

            <p className="uploadDescription">
              If you want to analyze non-public repositories, connect your GitHub account
              or simply upload package.json files.
              The uploaded files will not be shared with anyone
              and will be deleted when your session expire.
            </p>

            <div className="uploadContainer">
              <Upload
                files={files}
                onUpload={this.onUpload}
                onUpdate={this.refresh}
                feedbackPosition="float"
                style={{ height: '125px' }}
                />
            </div>

          </div>

        </Content>

        <Footer />

      </div>
    );
  }

}
