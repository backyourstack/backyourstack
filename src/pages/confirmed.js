import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { dispatchOrderMutation } from '../lib/opencollective';
import ConfirmationFAQ from '../../ConfirmationFAQ.md';

export default class Confirmed extends React.Component {
  static async getInitialProps({ query }) {
    let dispatchedOrders, error;
    if (query.orderId) {
      try {
        dispatchedOrders = await dispatchOrderMutation(parseInt(query.orderId));
      } catch (e) {
        error = e.message;
      }
    }

    return {
      next: query.next || '/',
      orderId: query.orderId,
      dispatchedOrders: dispatchedOrders || [],
      error: error || null,
    };
  }

  static propTypes = {
    loggedInUser: PropTypes.object,
    orderId: PropTypes.string,
    dispatchedOrders: PropTypes.array,
    error: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      dispatchedOrders: props.dispatchedOrders,
    };
  }

  renderDispatchedOrders(dispatchedOrders) {
    return (
      <div className="confirmationWrapper">
        <h3>Woot woot! 🎉</h3>
        <p>
          Your donation was successfully dispatched, you&apos;re now monthly
          backing the following collectives:
        </p>
        <div className="tableWrapper">
          <table>
            <tr>
              <th>Name</th>
              <th>Amount</th>
            </tr>
            {dispatchedOrders.map(order => {
              const collective = order.collective;
              return (
                <tr key={order.id}>
                  <td>{collective.name}</td>
                  <td>{order.totalAmount} per month</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    );
  }

  render() {
    const { dispatchedOrders } = this.state;
    return (
      <div className="Page ConfirmPage">
        <style jsx global>
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
            .confirmationWrapper {
              display: flex;
              flex-direction: column;
              text-align: center;
              align-items: center;
            }
            @media screen and (max-width: 640px) {
              .content {
                width: auto;
                padding: 20px 15px;
                margin: 50px 20px;
              }
            }
            .error {
              color: red;
              text-align: center;
            }
          `}
        </style>
        <Header
          loggedInUser={this.props.loggedInUser}
          login={false}
          brandAlign="auto"
        />
        {dispatchedOrders.length === 0 && (
          <div className="error">
            <h3>
              Your order was created but unable to dispatch funds at this time
            </h3>
            {this.props.error && <p>{this.props.error}</p>}
          </div>
        )}
        {dispatchedOrders.length !== 0 &&
          this.renderDispatchedOrders(dispatchedOrders)}
        <div className="content">
          <ConfirmationFAQ />
        </div>
        <Footer />
      </div>
    );
  }
}
