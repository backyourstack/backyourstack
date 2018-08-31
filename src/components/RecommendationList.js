import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Link } from '../routes';

import RecommendationCard from '../components/RecommendationCard';

export default class RecommendationList extends React.Component {

  static propTypes = {
    recommendations: PropTypes.array.isRequired,
    opencollective: PropTypes.object,
  };

  render () {
    const { recommendations, opencollective } = this.props;

    const projectsRequiringFunding = recommendations.filter(r => r.opencollective);

    return (
      <Fragment>
        <style jsx>{`
        .Recommendations {
          display: flex;
          flex-wrap: wrap;
        }
        `}
        </style>

        <div className="Recommendations">
          {projectsRequiringFunding.length === 0 &&
            <div className="error">
              <p>Sorry, we could not detect any projects requiring funding. We currently:</p>
              <ul>
                <li>detect dependencies from JavaScript (NPM), PHP (Composer), .NET (Nuget) and Go (dep).</li>
                <li>match them with projects registered on <a href="https://opencollective.com/">Open Collective</a></li>
              </ul>
              <p>
                Want so see something else? <Link route="contributing"><a>Contribute</a></Link>.
                Something not working as expected? <a href="https://github.com/opencollective/backyourstack/issues">Report an issue</a>.
              </p>
            </div>
          }
          {projectsRequiringFunding.length > 0 && projectsRequiringFunding.map(recommendation => (
            <RecommendationCard
              key={recommendation.name}
              opencollective={opencollective}
              recommendation={recommendation}
              />
          ))}
        </div>
      </Fragment>
    );
  }

}
