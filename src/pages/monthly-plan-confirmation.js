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
          status: 'dispatching',
        });
      }
    });
  }

  render() {
    const { status, errMesg } = this.state;
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
            @media screen and (max-width: 640px) {
              .contentWrapper {
                background: url(/static/img/mobile-background-colors.svg)
                  no-repeat;
                background-size: 100%;
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
            {status === 'dispatching' && (
              <div className="confirmationWrapper">
                <h3>Dispatch in process</h3>
                <p>
                  Your first payment is currently being dispatched, you&apos;ll
                  be notified via email as soon as the process completes.
                </p>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
