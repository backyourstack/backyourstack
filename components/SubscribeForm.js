import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { fetchJson } from '../src/fetch';

export default class SubscribeForm extends React.Component {
  static propTypes = {
    profile: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { email: '', subscribed: false };
  }

  handleChange = (event) => {
    const email = event.target.value;
    this.setState({ email });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.emailSubscribe(this.state.email, this.props.profile).then(() => {
      this.setState({ subscribed: true });
    });
  };

  emailSubscribe = (email, profile) =>
    fetchJson('/data/emailSubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ email, profile }),
    });

  render() {
    const { email, subscribed } = this.state;

    return (
      <Fragment>
        <style jsx>
          {`
            form {
              margin-top: 20px;
            }
            input[type='email'] {
              padding: 12px 17px;
              border: 1px solid rgba(18, 19, 20, 0.16);
              border-radius: 4px 0 0 4px;
              background-color: #f7f8fa;
              box-shadow: inset 0 1px 3px 0 rgba(18, 19, 20, 0.08);
              display: inline-block;
              box-sizing: border-box;
              width: calc(100% - 100px);
            }
            input[type='submit'] {
              display: inline-block;
              box-sizing: border-box;
              width: 100px;
              border-radius: 0 4px 4px 0;
              font-size: 12px;
              padding: 12px 17px;
            }
          `}
        </style>

        {!subscribed && (
          <form method="POST" action="" onSubmit={this.handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={this.handleChange}
              value={email}
            />
            <input
              type="submit"
              value="Subscribe"
              className="button bigButton"
            />
          </form>
        )}
        {subscribed && (
          <p>
            <strong>Successfully subscribed!</strong>
          </p>
        )}
      </Fragment>
    );
  }
}
