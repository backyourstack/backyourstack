import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { Link } from '../routes';

import { getProfileData } from '../lib/data';

import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

import DependencyTable from '../components/DependencyTable';
import RepositoryTable from '../components/RepositoryTable';
import RecommendationList from '../components/RecommendationList';

export default class Profile extends React.Component {

  static async getInitialProps ({ req, query }) {
    try {
      // The accessToken is only required server side (it's ok if it's undefined on client side)
      const accessToken = get(req, 'session.passport.user.accessToken');
      const data = await getProfileData(query.id, accessToken);
      return { ... data };
    } catch (error) {
      return { error };
    }
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    profile: PropTypes.object,
    repos: PropTypes.array,
    dependencies: PropTypes.array,
    recommendations: PropTypes.array,
    error: PropTypes.object,
  };

  render () {
    const { error, profile, repos, dependencies, recommendations, pathname, loggedInUser } = this.props;
    return (
      <div>
        <Header loggedInUser={loggedInUser} pathname={pathname} />
        <Content>
          {error &&
            <div>
              <p>{error.message}</p>
              <Link route="login" params={{ next: pathname }}>
                <a>Please Sign In with GitHub to avoid rate limit errors.</a>
              </Link>
            </div>
          }
          {!error &&
            <div>
              <h1>{profile.name}</h1>
              <div>
                <strong>Github Profile</strong>:&nbsp;
                <a href={`https://github.com/${profile.login}`}>
                  {`github.com/${profile.login}`}
                </a>
                &nbsp;-&nbsp;
                <strong>OpenCollective Profile</strong>:&nbsp;
                <em>unknown</em>
              </div>

              <h2>Recommendations</h2>
              <RecommendationList recommendations={recommendations} />

              <h2>Dependencies</h2>
              <DependencyTable dependencies={dependencies} />

              <h2>Repositories</h2>
              <RepositoryTable repositories={repos} />

            </div>
          }
        </Content>
        <Footer />
      </div>
    );
  }

}
