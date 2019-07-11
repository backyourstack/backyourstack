import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Footer from '../components/Footer';

import ConfirmationFAQ from '../../ConfirmationFAQ.md';

export default class Confirm extends React.Component {
  static getInitialProps(ctx) {
    return { next: ctx.query.next || '/' };
  }

  static propTypes = {
    loggedInUser: PropTypes.object,
  };

  render() {
    return (
      <div className="Page ConfirmPage">
        <style jsx>
          {`
            .confirmationMessage {
              display: flex;
              justify-content: center;
            }
            .confirmationMessage > p {
              font-size: 1.4rem;
            }
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

        <Header
          loggedInUser={this.props.loggedInUser}
          login={false}
          brandAlign="auto"
        />

        <div className="confirmationMessage">
          <p>
            Thank you for your contribution, your donations will be dispatched
            to various collectives, monthly.
          </p>
        </div>
        <div className="content">
          <ConfirmationFAQ />
        </div>

        <Footer />
      </div>
    );
  }
}
