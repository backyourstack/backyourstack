import React from 'react';
import PropTypes from 'prop-types';

export default class RecommendationList extends React.Component {

  static propTypes = {
    recommendations: PropTypes.array.isRequired,
  };

  render () {
    const { recommendations } = this.props;

    return (
      <div>
        <style jsx>{`
        .Recommendations {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .Recommendation {
          width: 180px;
          min-height: 300px;
          border-radius: 15px;
          background-color: #ffffff;
          box-shadow: 0 1px 3px 0 rgba(45, 77, 97, 0.2);
          margin: 10px;
          padding: 15px;
          text-align: center;
        }
        .Recommendation .name {
          height: 50px;
        }
        .Recommendation .description {
          font-size: 12px;
          color: #333;
          height: 100px;
        }
        .Recommendation .repos {
          height: 100px;
          font-size: 12px;
        }
        .Recommendation .repos {
          color: #333;
        }
        .Recommendation .repos a {
          color: #666;
        }
        .Recommendation .repos a:hover {
          color: #333;
          text-decoration: none;
        }
        .back-button a {
          display: block;
          border-radius: 15px;
          padding: 10px;
          text-decoration: none;
          background: #333;
          color: white;
        }
        .back-button a:hover {
          background: #666;
        }
        `}
        </style>
        <div className="Recommendations">
          {recommendations.filter(r => r.opencollective).map(recommendation => (
            <div key={recommendation.name} className="Recommendation">
              <div className="name"><b>{recommendation.opencollective.name}</b></div>
              <div className="description">{recommendation.opencollective.description}</div>
              <div className="repos">
                <strong>Used in</strong>:&nbsp;
                {recommendation.repos.slice(0, 3).map(repo => (
                  <span key={repo.id}>
                    {repo.full_name &&
                      <a href={`https://github.com/${repo.full_name}`}>{repo.full_name}</a>
                    }
                    {!repo.full_name &&
                      <span>{repo.name}</span>
                    }
                  </span>
                )).reduce( ( prev, curr ) => [ prev, ', ', curr ] )}
                {recommendation.repos.length > 3 && ` and ${recommendation.repos.length - 3 } others`}
              </div>
              <div className="back-button">
                <a href={`https://opencollective.com/${recommendation.opencollective.slug}`}>
                  Back this project
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

}
