import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import Header from '../components/Header';
import Footer from '../components/Footer';

import GithubLogo from '../static/img/github.svg';

export default class Login extends React.Component {

  static getInitialProps (ctx) {
    return { next: ctx.query.next || '/' };
  }

  static propTypes = {
    loggedInUser: PropTypes.object,
    next: PropTypes.string,
  };

  render () {
    return (
      <div className="Page LoginPage">

        <style jsx>{`
        .content {
          width: 540px;
          border: 1px solid #dcdcdd;
          border-radius: 12px;
          margin: 50px auto;
          padding: 40px 30px;
        }
        h2 {
          font-size: 20px;
          line-height: 26px;
          margin-top: 0;
        }
        h3 {
          font-size: 16px;
          line-height: 24px;
        }
        ul {
          padding-left: 40px;
        }
        .signInButton {
          width: 200px;
          margin: 50px auto 20px;
        }

        @media screen and (max-width: 640px) {
          .content {
            width:auto;
            padding: 20px 15px;
            margin: 50px 20px;
          }
          h2 {
            font-size: 18px;
            line-height: 24px;
          }
          ul {
            padding-left: 20px;
          }
        }
        `}
        </style>

        <Header loggedInUser={this.props.loggedInUser} login={false} brandAlign="auto" />

        <div className="content">
          <h2>Sign In with GitHub to give access to your private repositories.</h2>
          <h3>What are going to do with it?</h3>
          <ul>
            <li>We&#8217;ll only look for dependency files such as package.json.</li>
            <li>The data will be cached up to 24 hours, not stored longer than that.</li>
            <li>The data processed from your private repositories will only be accessible by you.</li>
            <li>On Sign Out, we will revoke all permissions.</li>
            <li>Trust us, the code is <a href="https://github.com/opencollective/backyourstack">Open Source</a> and you can audit it.</li>
          </ul>
          <h3>Want to analyze your organization repositories too?</h3>
          <ul>
            <li>Make sure to grant access to these in the GitHub permission page.</li>
          </ul>
          <NextLink href={{ pathname: '/auth/github', query: { next: this.props.next } }}>
            <a className="button bigButton signInButton">
              <GithubLogo className="logo" />
              Sign In with GitHub now
            </a>
          </NextLink>
        </div>

        <Footer />

      </div>
    );
  }

}
