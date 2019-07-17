import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchOrder } from '../lib/opencollective';
import ConfirmationFAQ from '../../ConfirmationFAQ.md';

export default class Confirmed extends React.Component {
  static getInitialProps({ query }) {
    return {
      next: query.next || '/',
      orderId: query.orderId,
    };
  }

  static propTypes = {
    loggedInUser: PropTypes.object,
    orderId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      dispatchedOrders: [],
    };
  }

  async componentDidMount() {
    if (!this.props.orderId) {
      return;
    }
    const order = await fetchOrder(parseInt(this.props.orderId));
    if (order.data.dispatchedOrders) {
      this.setState({
        dispatchedOrders: order.data.dispatchedOrders,
      });
    }
  }

  render() {
    const { dispatchedOrders } = this.state;
    console.log(dispatchedOrders);
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
          `}
        </style>
        <Header
          loggedInUser={this.props.loggedInUser}
          login={false}
          brandAlign="auto"
        />

        <div className="confirmationWrapper">
          <h3>Woot woot! 🎉</h3>
          <p>
            Your donation was successfully dispatched, you&apos;re now monthly
            backing the following collectives:
          </p>
          <div className="tableWrapper">
            {dispatchedOrders.length !== 0 && (
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
            )}
          </div>
        </div>
        <div className="content">
          <ConfirmationFAQ />
        </div>
        <Footer />
      </div>
    );
  }
}
