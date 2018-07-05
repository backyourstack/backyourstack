import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Footer from '../components/Footer';

import FAQ from '../../FAQ.md';

export default class Login extends React.Component {

  static getInitialProps (ctx) {
    return { next: ctx.query.next || '/' };
  }

  static propTypes = {
    loggedInUser: PropTypes.object,
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
          padding: 20px 30px;
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

        <Header loggedInUser={this.props.loggedInUser} login={false} brandAlign="auto" />

        <div className="content">
          <FAQ />
        </div>

        <Footer />

      </div>
    );
  }

}
