import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getOrgsForUser } from '../lib/github';

import { Link } from '../routes';

import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';
import UploadPackage from '../components/UploadPackage';

export default class Index extends React.Component {

  static async getInitialProps ({ req, query }) {
    const initialProps = {};

    let accessToken;
    if (req) {
      accessToken = get(req, 'session.passport.user.accessToken');
    } else if (typeof window !== 'undefined') {
      accessToken = get(window, '__NEXT_DATA__.props.pageProps.loggedInUser.accessToken');
    }

    if (accessToken) {
      initialProps.loggedInUserOrgs = await getOrgsForUser(accessToken);
    }

    return initialProps;
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
  }

  render () {
    const { pathname, loggedInUser, loggedInUserOrgs } = this.props;
    return (
      <div>
        <Header pathname={pathname} loggedInUser={loggedInUser} />
        <Content>
          {loggedInUser && (
            <>
              <h2>Welcome {loggedInUser.username}</h2>
              {loggedInUserOrgs &&
                <>
                  <p>Your organizations:</p>
                  <ul>
                    {loggedInUserOrgs.map(org => (
                      <li key={org.id}>
                        <Link route="profile" params={{ id: org.login }}>
                          <a>{org.login}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              }
            </>
          )}
          <h2>Sample Organizations</h2>
          <ul>
            <li><Link route="profile" params={{ id: 'facebook' }}><a>Facebook</a></Link></li>
            <li><Link route="profile" params={{ id: 'airbnb' }}><a>Airbnb</a></Link></li>
            <li><Link route="profile" params={{ id: 'square' }}><a>Square</a></Link></li>
          </ul>
          <UploadPackage />
        </Content>
        <Footer />
      </div>
    );
  }

}
