import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import { Link, Router } from '../routes';

import List from '../components/List';
import InputGroup from './InputGroup';

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
    const { q, ok, error } = this.state;
    return (
      <Fragment>
        <style jsx>
          {`
            .searchForm {
              position: relative;
              display: flex;
              flex-direction: column;
            }
            .searchInput {
              border: 1px solid rgba(24, 26, 31, 0.1);
              border-radius: 8px;
              background-color: #fff;
              display: flex;
              align-items: baseline;
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
            .searchInput div {
              color: #c0c5cc;
              background: #f5f7fa;
              font-size: 14px;
              line-height: 22px;
              text-align: center;
              border: none;
              border-top-left-radius: 8px;
              border-bottom-left-radius: 8px;
              padding: 10px;
            }
            .searchInput input {
              font-size: 16px;
              padding: 10px;
              border: 0;
              border-style: solid;
              background: transparent;
              width: calc(100% - 160px);
            }
            .searchInput input,
            .searchInput input::placeholder {
              color: #c0c5cc;
              font-size: 14px;
              line-height: 24px;
            }
            .searchInput input:focus {
              outline: none;
              color: #2e3033;
            }
            .searchButton {
              margin: 50px auto;
              width: 100%;
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
              font-size: 12px;
              right: 0;
              top: 0;
              margin-top: 5px;
            }
            .searchFeedback.ok {
              color: #3a2fac;
            }
            .searchFeedback.error {
              color: #f53152;
            }
            @media screen and (max-width: 500px) {
              .searchButton {
                margin-top: 25px;
              }
              .searchFeedback {
                width: auto;
                margin: 0;
                text-align: center;
              }
            }
          `}
        </style>

        <form
          className="searchForm"
          method="GET"
          action="/search"
          onSubmit={this.handleSubmit}
        >
          <InputGroup
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleFocus}
            type="url"
            name="q"
            value={q}
            prepend="github.com/"
            placeholder="your organization"
          />
          {error && <div className="searchFeedback error">{error}</div>}
          {ok && <div className="searchFeedback ok">{ok}</div>}
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
