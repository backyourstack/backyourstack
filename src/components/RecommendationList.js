import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from '../routes';

import RecommendationCard from '../components/RecommendationCard';

export default class RecommendationList extends React.Component {
  static propTypes = {
    recommendations: PropTypes.array.isRequired,
    opencollectiveAccount: PropTypes.object,
  };

  render() {
    const { recommendations, opencollectiveAccount } = this.props;

    const projects = recommendations.filter(
      (r) => r.opencollective || r.github,
    );

    return (
      <Fragment>
        <style jsx>
          {`
            .Recommendations {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
            }
          `}
        </style>

        <div className="Recommendations">
          {projects.length === 0 && (
            <div className="error">
              <p>
                Sorry, we could not detect any projects requiring funding. We
                currently:
              </p>
              <ul>
                <li>
                  detect dependencies from JavaScript (NPM), PHP (Composer),
                  .NET (Nuget), Go (dep), Ruby (RubyGems), and Python
                  (requirements.txt).
                </li>
                <li>
                  match them with projects registered on{' '}
                  <a href="https://opencollective.com/">Open Collective</a>
                </li>
              </ul>
              <p>
                Want so see something else?{' '}
                <Link route="contributing">
                  <a>See how to contribute</a>
                </Link>
                . Something not working as expected?{' '}
                <a href="https://github.com/backyourstack/backyourstack/issues">
                  Report an issue
                </a>
                .
              </p>
            </div>
          )}
          {projects.length > 0 &&
            projects.map((recommendation) => (
              <RecommendationCard
                key={recommendation.name}
                opencollectiveAccount={opencollectiveAccount}
                recommendation={recommendation}
              />
            ))}
        </div>
      </Fragment>
    );
  }
}
