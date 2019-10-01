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
            .contentWrapper {
              background: url(/static/img/background-colors.svg) no-repeat;
              margin: 0;
              padding: 20px;
              min-height: 700px;
            }
            .confirmationMessage {
              display: flex;
              justify-content: center;
            }
            .confirmationMessage > p {
              font-size: 1.4rem;
            }
            .content {
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .contentCard {
              background: #fff;
              border: 1px solid rgba(24, 26, 31, 0.1);
              border-radius: 8px;
              width: 540px;
              margin-top: 30px;
              padding: 20px 30px;
              color: #76777a;
              box-sizing: border-box;
            }
            .confirmationWrapper h1 {
              font-weight: 900;
              font-size: 32px;
              line-height: 36px;
              letter-spacing: -0.4px;
              color: #141414;
            }
            .confirmationWrapper h3 {
              font-size: 20px;
              line-height: 22px;
              letter-spacing: -0.2px;
              color: #141414;
            }
            .tableDescription {
              font-size: 14px;
              font-weight: 400;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table th,
            table td {
              border-bottom: 1px solid #dcdee0;
              padding: 0.5em;
              white-space: nowrap;
              font-size: 14px;
            }
            table tr th:nth-child(2),
            table tr td:nth-child(2) {
              text-align: right;
            }
            table tr th:nth-child(1),
            table tr td:nth-child(1) {
              text-align: left;
            }
            table th {
              text-transform: uppercase;
              font-weight: bold;
              font-size: 10px;
            }
            .collectiveLink:hover {
              color: #76777a;
            }
            .note {
              font-size: 12px;
              line-height: 18px;
              color: #4e5052;
            }
            .thankYouText {
              font-size: 20px;
              line-height: 22px;
              color: #141414;
              margin-top: 30px;
              margin-bottom: 30px;
            }
            @media screen and (max-width: 640px) {
              .contentWrapper {
                background: url(/static/img/mobile-background-colors.svg)
                  no-repeat;
                background-size: 100%;
              }
              .confirmationWrapper h1 {
                font-size: 24px;
                margin-bottom: 5px;
              }
              .confirmationWrapper h3 {
                font-size: 16px;
                margin-top: 5px;
              }
              .contentCard {
                width: 100%;
              }
            }
            .error {
              color: red;
              text-align: center;
              align-items: center;
              flex-direction: column;
              display: flex;
            }
            .error h3 {
              font-size: 18px;
              margin-bottom: 5px;
            }
            .dispatchingWrapper {
              text-align: center;
            }
            .contact-link {
              text-decoration: none;
              color: #71757a;
              margin-top: 25px;
            }
            .contact-link:hover {
              color: #71757a;
            }
            .contactBtn {
              padding: 10px;
              border: 1px solid #c4c7cc;
              width: 120px;
              text-align: center;
              border-radius: 100px;
              font-size: 14px;
              white-space: nowrap;
            }
            .errorDescription {
              font-size: 14px;
              margin-top: 5px;
            }
          `}
        </style>
        <Header
          loggedInUser={this.props.loggedInUser}
          login={false}
          brandAlign="auto"
        />
        <div className="contentWrapper">
          <div className="content">
            {status === 'failure' && (
              <div className="error contentCard">
                <h3>Failed to dispatch fund.</h3>
                {errMesg && <p className="errorDescription">{errMesg}</p>}
                <a
                  href="mailto:support@opencollective.com"
                  className="contact-link"
                >
                  <div className="contactBtn">Contact Support</div>
                </a>
              </div>
            )}
            {status === 'processing' && (
              <div className="dispatchingWrapper contentCard">
                <h3>Dispatching...</h3>
              </div>
            )}
            {status === 'success' && (
              <div className="confirmationWrapper">
                <h1>Woot woot! 🎉</h1>
                <h3>Your first payment was successfully dispatched.</h3>
                <div className="tableWrapper contentCard">
                  <p className="tableDescription">
                    You&apos;re contributing to the following Collectives:
                  </p>
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
                                className="collectiveLink"
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
                  <p className="tableDescription">
                    That&apos;s it! You will be charged for the first time
                    today, then on the 1st of each month from now on. The funds
                    will be automatically distributed to your dependencies.
                  </p>
                  <p className="note">
                    <strong>*Note</strong>: Since the next charge will be on the
                    1st of the month, you may be charged twice in a short period
                    if you set this up near the end of the month.
                  </p>
                  <h3 className="thankYouText">
                    Thank you for Backing Your Stack!
                  </h3>
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
