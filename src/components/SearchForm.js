import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { debounce } from 'lodash';

import { Link, Router } from '../routes';

import List from '../components/List';

import { fetchJson } from '../lib/fetch';

const getProfile = slug =>
  process.env.IS_CLIENT
    ? fetchJson(`/data/getProfile?slug=${slug}`)
    : import('../lib/data').then(m => m.getProfile(slug));

export default class SearchForm extends React.Component {
  static propTypes = {
    orgs: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
    this.state = { ok: null, error: null, q: '', focused: false };
    this.stateFeedbackDebounced = debounce(this.stateFeedback.bind(this), 333);
  }

  async stateFeedback(q) {
    const profile = await getProfile(q);

    // Handle non-matching feedback
    // (it's possible that 'q' changed since we fired the request,
    // we could try to cancel the http request but this is simpler like that)
    if (this.state.q !== q) {
      this.stateFeedbackDebounced(this.state.q);
      return;
    }
    if (!profile) {
      this.setState({
        error:
          '✗ There is no GitHub organization or user with this identifier.',
        ok: null,
      });
    } else {
      this.setState({
        error: null,
        ok: '✓ This is a valid GitHub identifier.',
      });
    }
  }

  handleChange = event => {
    const q = event.target.value;
    this.setState({ q });
    if (q) {
      this.stateFeedbackDebounced(q);
    } else {
      this.setState({ ok: null, error: null });
      this.stateFeedbackDebounced.cancel();
    }
  };

  handleSubmit = event => {
    if (this.state.q && this.state.q.length > 0) {
      Router.pushRoute('search', { q: this.state.q });
    }
    event.preventDefault();
  };

  search = (event, q) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ q });
    Router.pushRoute('search', { q });
  };

  focus = () => this.searchInput.current.focus();

  canSubmit = () => this.state.q && !this.state.error;

  isFocused = () =>
    document && document.activeElement === this.searchInput.current;

  handleFocus = () => this.setState({ focused: this.isFocused() });

  searchLink = profile => (
    <Link key={profile.login} route="profile" params={{ id: profile.login }}>
      <a
        onClick={event => this.search(event, profile.login)}
        href={`/${profile.login}`}
      >
        {profile.login}
      </a>
    </Link>
  );

  render() {
    const { orgs } = this.props;
    const { q, ok, error, focused } = this.state;

    return (
      <Fragment>
        <style jsx>
          {`
            form {
              position: relative;
            }
            .searchInput {
              padding: 12px 17px;
              position: relative;
              border: 1px solid rgba(18, 19, 20, 0.16);
              border-radius: 4px;
              background-color: #f7f8fa;
              box-shadow: inset 0 1px 3px 0 rgba(18, 19, 20, 0.08);
            }
            .searchInput.focused {
              background: white;
            }
            .searchInput.focused,
            .searchInput:hover {
              border-color: #3a2fac;
            }
            .searchInput.focused.error {
              border-color: #f53152;
            }
            .searchInput span {
              font-size: 16px;
              color: #c2c6cc;
            }
            .searchInput input {
              font-size: 16px;
              border: 0;
              border-style: solid;
              background: transparent;
              width: calc(100% - 160px);
            }
            .searchInput input,
            .searchInput input::placeholder {
              color: #9399a3;
            }
            .searchInput input:focus {
              outline: none;
              color: #2e3033;
            }

            .searchButton {
              margin: 50px auto;
              width: 250px;
            }

            .searchExamples {
              font-size: 12px;
              text-align: center;
              color: #9399a3;
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
              top: 0;
              margin-right: -220px;
              margin-top: 5px;
            }
            .searchFeedback.ok {
              color: #3a2fac;
            }
            .searchFeedback.error {
              color: #f53152;
            }

            @media screen and (max-width: 500px) {
              .searchInput {
                margin-top: 25px;
                padding: 10px 10px;
              }
              .searchInput span {
                font-size: 14px;
              }
              .searchInput input {
                font-size: 14px;
                width: calc(100% - 140px);
              }
              .searchButton {
                margin-top: 25px;
              }
              .searchFeedback {
                position: static;
                width: auto;
                margin: 0;
                text-align: center;
              }
            }
          `}
        </style>

        <form method="GET" action="/search" onSubmit={this.handleSubmit}>
          <div
            className={classNames('searchInput', {
              error: !!error,
              ok: !!ok,
              focused: focused,
            })}
            onClick={this.focus}
          >
            <span>https://github.com/</span>
            <input
              ref={this.searchInput}
              type="text"
              name="q"
              value={q}
              placeholder="your organization"
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleFocus}
              autoComplete="off"
              autoCapitalize="none"
            />
          </div>

          {error && <div className="searchFeedback error">{error}</div>}
          {ok && <div className="searchFeedback ok">{ok}</div>}
          {!error && !ok && (
            <div className="searchFeedback placeholder">&nbsp;</div>
          )}

          {orgs && orgs.length > 0 && (
            <p className="searchExamples">
              Your organizations: &nbsp;
              <List array={orgs} map={this.searchLink} others={false} />
            </p>
          )}

          {!orgs && (
            <p className="searchExamples">
              e.g.: &nbsp;
              <List
                array={[
                  { login: 'facebook' },
                  { login: 'airbnb' },
                  { login: 'algolia' },
                ]}
                map={this.searchLink}
                others={false}
              />
            </p>
          )}

          <input
            type="submit"
            value="Analyze your stack"
            className="bigButton searchButton"
            disabled={this.canSubmit() ? false : true}
          />
        </form>
      </Fragment>
    );
  }
}
