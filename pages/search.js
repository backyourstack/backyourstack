import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { Link } from '../routes';

import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

import { getProfile, searchUsers } from '../lib/github';

export default class Search extends React.Component {

  static async getInitialProps ({ req, query }) {

    let accessToken;
    if (req) {
      accessToken = get(req, 'session.passport.user.accessToken');
    } else if (typeof window !== 'undefined') {
      accessToken = get(window, '__NEXT_DATA__.props.pageProps.loggedInUser.accessToken');
    }

    const q = query.q;

    const profile = await getProfile(q, accessToken);
    const searchResults = await searchUsers({ q }, accessToken);
    if (profile) {
      searchResults.items = searchResults.items.filter(i => i.id !== profile.id);
    }

    return { q, profile, searchResults };

  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    q: PropTypes.string,
    profile: PropTypes.object,
    searchResults: PropTypes.object,
  };

  render () {
    const { loggedInUser, pathname, q, profile, searchResults } = this.props;
    return (
      <div>
        <Header loggedInUser={loggedInUser} pathname={pathname} />
        <Content>
          <h2>Search results for `{q}`</h2>
          <ul>
          {profile && (
            <Fragment>
              <li><strong>Perfect Match</strong>:
                &nbsp;
                <Link route="profile" params={{ id: profile.login }}>
                  <a>{profile.login}</a>
                </Link>
                &nbsp;
                ({profile.type})
              </li>
            </Fragment>
          )}
          {searchResults.items.map(item => (
             <li key={item.id}>
              <Link route="profile" params={{ id: item.login }}>
                <a>{item.login}</a>
              </Link>
              &nbsp;
              ({item.type})
            </li>
          ))}
          </ul>
        </Content>
        <Footer />
      </div>
    );
  }

}
