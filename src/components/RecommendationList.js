import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import RecommendationCard from '../components/RecommendationCard';

export default class RecommendationList extends React.Component {

  static propTypes = {
    recommendations: PropTypes.array.isRequired,
    opencollective: PropTypes.object,
  };

  render () {
    const { recommendations, opencollective } = this.props;

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
          {recommendations.filter(r => r.opencollective).map(recommendation => (
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
