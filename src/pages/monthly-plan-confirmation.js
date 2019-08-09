import React from 'react';
import PropTypes from 'prop-types';

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
    const params = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
      credentials: 'same-origin',
    };

    this.setState({ status: 'processing' });
    fetch('/order/dispatch', params)
      .then(response => {
        return response.json();
      })
      .then(data => {
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
              if (order) {
                return (
                  <tr key={order.id}>
                    <td>{order.collective.name}</td>
                    <td>{order.totalAmount} per month</td>
                  </tr>
                );
              }
            })}
          </table>
        </div>
      </div>
    );
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
            .dispatchingWrapper {
              text-align: center;
              color: green;
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
              <h3>Dispatching....</h3>
            </div>
          )}
          {status === 'success' &&
            this.renderDispatchedOrders(dispatchedOrders)}
        </div>
        <Footer />
      </div>
    );
  }
}
