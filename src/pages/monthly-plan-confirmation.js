import React from 'react';
import PropTypes from 'prop-types';

import { postJson } from '../lib/fetch';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default class MonthlyPlanConfirmation extends React.Component {
  static getInitialProps({ query }) {
    return {
      next: query.next || '/',
      orderId: query.orderId || null,
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
      status: null,
      errMesg: null,
    };
  }

  async componentDidMount() {
    const { orderId } = this.props;
    if (!orderId) {
      return;
    }
    await this.dispatchOrder(parseInt(orderId));
  }

  dispatchOrder(orderId) {
    this.setState({ status: 'processing' });

    postJson('/order/dispatch', { orderId }).then(data => {
      if (data.error) {
        this.setState({
          status: 'failure',
          errMesg: data.error,
        });
      } else {
        this.setState({
          status: 'success',
          dispatchedOrders: data,
        });
      }
    });
  }

  render() {
    const { dispatchedOrders, status, errMesg } = this.state;
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
            .dispatchingWrapper {
              text-align: center;
            }
          `}
        </style>
        <Header
          loggedInUser={this.props.loggedInUser}
          login={false}
          brandAlign="auto"
        />
        <div className="content">
          {status === 'failure' && (
            <div className="error">
              <h3>
                Your order was created but unable to dispatch funds at this time
              </h3>
              {errMesg && <p>{errMesg}</p>}
            </div>
          )}
          {status === 'processing' && (
            <div className="dispatchingWrapper">
              <h3>Dispatching...</h3>
            </div>
          )}
          {status === 'success' && (
            <div className="confirmationWrapper">
              <h3>
                Woot woot! 🎉 Your first payment was successfully dispatched.
              </h3>
              <p>You&apos;re contributing to the following Collectives:</p>
              <div className="tableWrapper">
                <table>
                  <tr>
                    <th>Collective</th>
                    <th>Amount</th>
                  </tr>
                  {dispatchedOrders.map(order => {
                    if (order) {
                      return (
                        <tr key={order.id}>
                          <td>
                            <a
                              href={`${process.env.OPENCOLLECTIVE_BASE_URL}/${order.collective.slug}`}
                            >
                              {order.collective.name}
                            </a>
                          </td>
                          <td>${(order.totalAmount / 100).toFixed(2)}</td>
                        </tr>
                      );
                    }
                  })}
                </table>
                <p>
                  That&apos;s it! You will be charged for the first time today,
                  then on the 1st of each month from now on. The funds will be
                  automatically distributed to your dependencies.
                </p>
                <ul>
                  <li>
                    Note: Since the next charge will be on the 1st of the month,
                    you may be charged twice in a short period if you set this
                    up near the end of the month.
                  </li>
                </ul>
                <p>Thank you for Backing Your Stack!</p>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}
