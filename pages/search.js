import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { Link, Router } from '../routes';

import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

import { fetchJson } from '../lib/fetch';

const getProfile = (slug, accessToken) =>
  process.env.IS_CLIENT
    ? fetchJson(`/data/getProfile?slug=${slug}`)
    : import('../lib/data').then((m) => m.getProfile(slug, accessToken));

const searchUsers = (q, accessToken) =>
  process.env.IS_CLIENT
    ? fetchJson(`/data/searchUsers?q=${q}`)
    : import('../lib/data').then((m) => m.searchUsers(q, accessToken));

export default class Search extends React.Component {
  static async getInitialProps({ req, res, query }) {
    const q = query.q;

    // The accessToken is only required server side (it's ok if it's undefined on client side)
    const accessToken = get(req, 'session.passport.user.accessToken');

    const profile = await getProfile(q, accessToken);

    if (profile) {
      if (res) {
        res.writeHead(302, { Location: `/${profile.login}` });
        res.end();
        res.finished = true;
      } else {
        Router.pushRoute('profile', { id: profile.login });
      }
      return {};
    }

    const searchResults = await searchUsers(q, accessToken);

    return { q, searchResults };
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    q: PropTypes.string,
    profile: PropTypes.object,
    searchResults: PropTypes.object,
  };

  render() {
    const { loggedInUser, pathname, q, profile, searchResults } = this.props;
    return (
      <div>
        <Header loggedInUser={loggedInUser} pathname={pathname} />
        <Content>
          <h2>Search results for `{q}`</h2>
          <ul>
            {profile && (
              <Fragment>
                <li>
                  <strong>Perfect Match</strong>: &nbsp;
                  <Link route="profile" params={{ id: profile.login }}>
                    <a>{profile.login}</a>
                  </Link>
                  &nbsp; ({profile.type})
                </li>
              </Fragment>
            )}
            {searchResults.items.map((item) => (
              <li key={item.id}>
                <Link route="profile" params={{ id: item.login }}>
                  <a>{item.login}</a>
                </Link>
                &nbsp; ({item.type})
              </li>
            ))}
          </ul>
        </Content>
        <Footer />
      </div>
    );
  }
}
