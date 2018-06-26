import React, { Fragment } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';

import { Link, Router } from '../routes';

import { getProfile } from '../lib/data';

export default class SearchForm extends React.Component {

  constructor (props) {
    super(props);
    this.searchInput = React.createRef();
    this.state = { ok: null, error: null, q: '' };

    this.stateFeedbackDebounced = debounce(this.stateFeedback.bind(this), 333);
  }

  async stateFeedback (q) {
    const profile = await getProfile(q);
    // Handle non-matching
    if (this.state.q !== q) {
      this.stateFeedbackDebounced(this.state.q);
      return;
    }
    if (!profile) {
      this.setState({
        error: 'There is no GitHub organization or user with this identifier.',
        ok: null,
      });
    } else {
      this.setState({
        error: null,
        ok: 'This is a valid GitHub organization or user.',
      });
    }
  }

  handleChange = (event) => {
    const q = event.target.value;
    this.setState({ q });
    if (q) {
      this.stateFeedbackDebounced(q);
    } else {
      this.setState({ ok: null, error: null });
      this.stateFeedbackDebounced.cancel();
    }
  };

  handleSubmit = (event) => {
    if (this.state.q && this.state.q.length > 0) {
      Router.pushRoute('search', { q: this.state.q });
    }
    event.preventDefault();
  };

  searchFocus = () => {
    this.searchInput.current.focus();
  };

  canSubmit = () => {
    if (!this.state.q || this.state.q.length === 0) {
      return false;
    }
    if (this.error) {
      return false;
    }
    return true;
  };

  render () {
    const { q, ok, error } = this.state;
    return (
      <Fragment>

        <style jsx>{`
          .searchInput {
            margin: 50px auto 10px;
            border: 1px solid #3A2FAC;
            border-radius: 12px;
            padding: 20px;
            position: relative;
          }
          .searchInput.ok {
            border-color: green; // FIXME
          }
          .searchInput.error {
            border-color: #F53152;
          }
          .searchInput span {
            font-size: 20px;
            color: #C2C6CC;
          }
          .searchInput input {
            font-size: 20px;
            color: #2E3033;
            border: 0;
            background: transparent;
          }

          .searchInput input:focus {
            outline-width: 0;
          }
          .searchButton {
            border-radius: 8px;
            background-color: #3A2FAC;
            padding: 20px;
            font-size: 14px;
            color: white;
            display: block;
            margin: 50px auto;
            width: 250px;
          }
          .searchButton:hover {
            background-color: black; // FIXME
          }
          .searchButton:disabled {
            background-color: #d2cbed;
          }
          .searchExamples {
            font-size: 12px;
            text-align: center;
          }
          .searchExamples a {
            color: inherit;
            text-decoration: underline;
          }
          .searchExamples a:hover {
            text-decoration: none;
          }
          .searchFeedback {
            position: absolute;
            font-size: 12px;
            width: 200px;
            right: 0;
            margin-right: -220px;
          }
          .searchFeedback.ok {
            color: green; // FIXME
          }
          .searchFeedback.error {
            color: #F53152;
          }
        `}
        </style>
        <form method="GET" action="/search" onSubmit={this.handleSubmit}>

          <div
            className={classNames('searchInput', { error: !!error, ok: !!ok })}
            onClick={() => this.searchInput.current.focus()}
            >
            {error &&
              <div className="searchFeedback error">{error}</div>
            }
            {ok &&
              <div className="searchFeedback ok">{ok}</div>
            }
            <span>https://github.com/</span>
            <input
              ref={this.searchInput}
              type="text"
              name="q"
              value={q}
              onChange={this.handleChange}
              autoComplete="off"
              />
          </div>

          <p className="searchExamples">
            e.g.&nbsp;
            <Link route="profile" params={{ id: 'facebook' }}><a>Facebook</a></Link>
            ,&nbsp;
            <Link route="profile" params={{ id: 'airbnb' }}><a>Airbnb</a></Link>
            ,&nbsp;
            <Link route="profile" params={{ id: 'square' }}><a>Square</a></Link>
          </p>

          <input
            type="submit"
            value="Analyze your stack"
            className="searchButton"
            disabled={this.canSubmit() ? false : true}
            />

        </form>

      </Fragment>
    );
  }

}
