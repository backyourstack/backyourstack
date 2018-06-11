import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { get } from 'lodash';

import { getProfile, getReposForProfile } from '../lib/github';
import { getRawStatsWithProjectFromRepos, scoreAndSortRawStats } from '../lib/utils';

import Header from '../components/Header';
import Content from '../components/Content';

export default class Profile extends React.Component {

  static async getInitialProps ({ req, query }) {
    const accessToken = get(req, 'session.passport.user.accessToken');
    try {
      const profile = await getProfile(query.id, accessToken);
      const repos = await getReposForProfile(profile, accessToken);
      const rawStats = await getRawStatsWithProjectFromRepos(repos);
      const recommendations = scoreAndSortRawStats(rawStats);
      return { profile, repos, recommendations }
    } catch (error) {
      return { error }
    }
  }

  static propTypes = {
    loggedInUser: PropTypes.object,
    profile: PropTypes.object,
    repos: PropTypes.array,
    recommendations: PropTypes.array,
    reqUrl: PropTypes.string,
    error: PropTypes.object,
  }

  render () {
    const { error, profile, repos, recommendations, loggedInUser, reqUrl } = this.props;
    return (
      <div>
        <Header loggedInUser={loggedInUser} reqUrl={reqUrl} />
        <Content>
          {error &&
            <div>
              <p>{error.message}</p>
              <Link href={{ pathname: '/login', query: { next: reqUrl } }}>
                <a>Please sign in to avoid rate limit errors.</a>
              </Link>
            </div>
          }
          {!error &&
            <div>
              <style jsx>{`
              .flex-grid {
                display: flex;
              }
              .col {
                flex: 1;
              }
              `}
              </style>
              <h1>{profile.name}</h1>
              <div className="flex-grid">
                <div className="col repos">
                  <h2>Repositories</h2>
                  <ul>
                    {repos.map(repo => (
                      <li key={repo.id}>
                        <p>
                          {repo.full_name}<br />
                          <em>{repo.dependencies.length} dependencies detected</em>
                        </p>
                        <div style={{ display: 'none' }}>
                          {repo.dependencies && (
                            <ul>
                              {repo.dependencies.map(dep => (
                                <li key={dep.name}>{dep.name}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col dependencies">
                  <h2>Recommendations</h2>
                  <ul>
                    {recommendations.map(recommendation => (
                      <li key={recommendation.id}>
                        {recommendation.id}
                        {recommendation.project.opencollective && (
                          <>
                            :&nbsp;
                            <span>
                              <a href={`https://opencollective.com/${recommendation.project.opencollective.slug}`}>
                                Back it on Open Collective!
                              </a>
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          }
        </Content>
      </div>
    )
  }

}
