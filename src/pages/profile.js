import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NextLink from 'next/link';
import { get } from 'lodash';

import { Link } from '../routes';

import { getProfileData } from '../lib/data';

import Header from '../components/Header';
import Footer from '../components/Footer';

import DependencyTable from '../components/DependencyTable';
import RepositoryTable from '../components/RepositoryTable';
import RecommendationList from '../components/RecommendationList';

import TwitterLogo from '../static/img/twitter.svg';
import FacebookLogo from '../static/img/facebook.svg';

export default class Profile extends React.Component {

  static async getInitialProps ({ req, query }) {
    const initialProps = { section: query.section };
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
    section: PropTypes.PropTypes.oneOf(['dependencies', 'repositories']),
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    profile: PropTypes.object,
    opencollective: PropTypes.object,
    repos: PropTypes.array,
    dependencies: PropTypes.array,
    recommendations: PropTypes.array,
    error: PropTypes.object,
  };

  twitterText = () => 'I like Back Your Stack';

  profileLink = () => `https://backyourstack.now.sh/${this.props.profile.login}`;

  githubLink = () => `https://github.com/${this.props.profile.login}`;

  opencollectiveLink = () => this.props.opencollective && `https://opencollective.com/${this.props.opencollective.slug}`;

  profileName = () => {
    if (this.props.opencollective) {
      if (this.props.opencollective.name.length < this.props.profile.name.length) {
        return this.props.opencollective.name;
      }
    }
    return this.props.profile.name;
  };

  render () {
    const { section, error, profile, opencollective, repos, dependencies, recommendations, pathname, loggedInUser } = this.props;
    return (
      <div className="Page ProfilePage">

        <style jsx global>{`
        .ProfilePage {
          position: relative;
        }
        @media screen and (min-width:500px) {
          .ProfilePage footer {
            display: none !important;
          }
        }
        `}
        </style>

        <style jsx>{`
        .shortStats {
          color: #121314;
          font-size: 16px;
          line-height: 24px;
        }

        .profileLink a {
          color: #7448FF;
          text-decoration: none;
          display: block;
        }
        .profileLink a:hover {
          text-decoration: underline;
        }

        .profileLink a.backyourstack {
          margin-bottom: 10px;
        }

        .profileLink, .socialLinks {
           margin-top: 25px;
        }

        .button:last-child {
          margin-right: 0;
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
              <h1>{this.profileName()}</h1>
              <div className="navigation-items">
                <Link route="profile" params={{ id: profile.login }}>
                  <a className={classNames({ active: !section })}>
                    Projects requiring funding
                  </a>
                </Link>
                <Link route="profile" params={{ id: profile.login, section: 'dependencies' }}>
                  <a className={classNames({ active: section === 'dependencies' })}>
                    Detected Dependencies
                  </a>
                </Link>
                <Link route="profile" params={{ id: profile.login, section: 'repositories' }}>
                  <a className={classNames({ active: section === 'repositories' })}>
                    Analyzed Repositories
                  </a>
                </Link>
              </div>
            </div>

            <aside>

              <div className="shortStats">
                <strong>{repos.length}</strong> repositories
                depending on <strong>{dependencies.length}</strong>&nbsp;Open Source projects.
              </div>

              <div className="profileLink">
                <a href={this.profileLink()} className="backyourstack">
                  &gt; {this.profileLink().replace('https://', '')}
                </a>
                <a href={this.githubLink()} className="github">
                  &gt; {this.githubLink().replace('https://', '')}
                </a>
                {opencollective &&
                  <a href={this.opencollectiveLink()} className="opencollective">
                    &gt; {this.opencollectiveLink().replace('https://', '')}
                  </a>
                }
              </div>

              <div className="socialLinks">
                <NextLink href={{ pathname: 'http://twitter.com/share', query: { text: this.twitterText() } }}>
                  <a className="button shareButton" title="Share on Twitter">
                    <TwitterLogo className="logo" />
                    &nbsp;
                    Tweet
                  </a>
                </NextLink>
                <NextLink href={{ pathname: 'https://www.facebook.com/sharer/sharer.php', query: { u: this.profileLink() } }}>
                  <a className="button shareButton" title="Share on Facebook">
                    <FacebookLogo className="logo" />
                    &nbsp;
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
                <RecommendationList recommendations={recommendations} opencollective={opencollective} />
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

        <Footer />

      </div>
    );
  }

}
