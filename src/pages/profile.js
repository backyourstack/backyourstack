import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NextLink from 'next/link';
import { get } from 'lodash';

import { Link } from '../routes';

import { getProfileData } from '../lib/data';

import Header from '../components/Header';

import DependencyTable from '../components/DependencyTable';
import RepositoryTable from '../components/RepositoryTable';
import RecommendationList from '../components/RecommendationList';

export default class Profile extends React.Component {

  static async getInitialProps ({ req, query }) {
    const initialProps = { id: query.id, section: query.section };
    try {
      // The accessToken is only required server side (it's ok if it's undefined on client side)
      const accessToken = get(req, 'session.passport.user.accessToken');
      const data = await getProfileData(query.id, accessToken);
      return { ...initialProps, ... data };
    } catch (error) {
      return { ...initialProps, error };
    }
  }

  static propTypes = {
    id: PropTypes.string,
    section: PropTypes.string,
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    profile: PropTypes.object,
    repos: PropTypes.array,
    dependencies: PropTypes.array,
    recommendations: PropTypes.array,
    error: PropTypes.object,
  };

  twitterText = () => 'I like Back Your Stack';

  profileLink = () => `https://backyourstack.now.sh/${this.props.profile.login}`;

  render () {
    const { section, error, profile, repos, dependencies, recommendations, pathname, loggedInUser } = this.props;
    return (
      <div className="Page ProfilePage">

        <style jsx global>{`
        .ProfilePage {
          position: relative;
        }
        `}
        </style>

        <style jsx>{`
        .navigation {
          background-color: #f7f8fa;
          padding: 20px 56px;
          position: relative;
        }
        .navigation h1 {
          margin: 0;
          padding: 0;
          color: #2E3033;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: -0.4px;
          line-height: 36px;
        }
        .navigation-items {
          position: absolute;
          left: 380px;
          bottom: -1px;
        }
        .navigation-items a {
          color: #2E2E99;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.8px;
          line-height: 16px;
          text-decoration: none;
          display: inline-block;
          text-transform: uppercase;
          border-bottom: 2px solid transparent;
          margin-right: 40px;
          padding-bottom: 20px;
        }
        .navigation-items a.active, .navigation-items a:hover {
          border-color: #2E2E99;
        }

        aside {
          width: 250px;
          padding: 45px 60px;
          position: absolute;
        }

        .shortStats {
          color: #121314;
          font-size: 16px;
          line-height: 24px;
        }

        .profileLink a {
          color: #7448FF;
          text-decoration: none;
        }
        .profileLink a:hover {
          text-decoration: underline;
        }

        .profileLink, .socialLinks {
           margin-top: 25px;
        }

        .btn {
          display: inline-block;
          color: #8800ff;
          border: 1px solid #D5DAE0;
          border-radius: 6px;
          padding: 10px 20px;
          margin-right: 15px;
          color: inherit;
          text-decoration: none;
        }

        .btn:hover {
          text-decoration: underline;
        }

        .btn:last-child {
          margin-right: 0;
        }

        main {
          padding: 45px 0;
          padding-right: 56px;
          position: absolute;
          left: 380px;
        }
        `}
        </style>

        <Header loggedInUser={loggedInUser} pathname={pathname} />

        {error &&
          <div>
            <p>{error.message}</p>
            <Link route="login" params={{ next: pathname }}>
              <a>Please Sign In with GitHub to avoid rate limit errors.</a>
            </Link>
          </div>
        }

        {!error &&
          <Fragment>
            <div className="navigation">
              <h1>{profile.name}</h1>
              <div className="navigation-items">
                <Link route="profile" params={{ id: profile.login, section: 'repositories' }}>
                  <a className={classNames({ active: section === 'repositories' })}>
                    All Repositories
                  </a>
                </Link>
                <Link route="profile" params={{ id: profile.login, section: 'dependencies' }}>
                  <a className={classNames({ active: section === 'dependencies' })}>
                    All Dependencies
                  </a>
                </Link>
                <Link route="profile" params={{ id: profile.login }}>
                  <a className={classNames({ active: !section || section === 'recommendations' })}>
                    Projects requiring funding
                  </a>
                </Link>
              </div>
            </div>

            {false &&
              <div>
                <strong>Github Profile</strong>:&nbsp;
                <a href={`https://github.com/${profile.login}`}>
                  {`github.com/${profile.login}`}
                </a>
                &nbsp;-&nbsp;
                <strong>OpenCollective Profile</strong>:&nbsp;
                <em>unknown</em>
              </div>
            }

            <aside>

              <div className="shortStats">
                <strong>{repos.length}</strong> repositories
                depending on <strong>{dependencies.length}</strong>&nbsp;Open Source projects.
              </div>

              <div className="profileLink">
                <a href={this.profileLink()}>
                  &gt; {this.profileLink().replace('https://', '')}
                </a>
              </div>

              <div className="socialLinks">
                <NextLink href={{ pathname: 'http://twitter.com/share', query: { text: this.twitterText() } }}>
                  <a className="btn">
                    Tweet
                  </a>
                </NextLink>
                <NextLink href={{ pathname: 'https://www.facebook.com/sharer/sharer.php', query: { u: this.profileLink() } }}>
                  <a className="btn">
                    Share
                  </a>
                </NextLink>
              </div>

            </aside>

            <main>

              {false &&
                <div>
                  ⟶  5 of them need financial support to sustain their community:
                </div>
              }

              {(!section || section === 'recommendations') &&
                <RecommendationList recommendations={recommendations} />
              }

              {section === 'dependencies' &&
                <DependencyTable dependencies={dependencies} />
              }

              {section === 'repositories' &&
                <RepositoryTable repositories={repos} />
              }

            </main>

          </Fragment>
        }

      </div>
    );
  }

}
