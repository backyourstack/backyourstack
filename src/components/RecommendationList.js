import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import List from '../components/List';

export default class RecommendationList extends React.Component {

  static propTypes = {
    recommendations: PropTypes.array.isRequired,
  };

  budgetFormatter = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

  formatBudget = (amount) => `${this.budgetFormatter.format(Math.round(amount))} USD`;

  formatDonation = (amount) => {
    if (amount > 1000) {
      return `$${Math.round(amount / 1000 )}K`;
    } else {
      return `$${Math.round(amount)}`;
    }
  };

  nextGoal = (recommendation) => {
    const goals = get(recommendation, 'opencollective.goals', []);
    const balance = get(recommendation, 'opencollective.stats.balance', 0);

    const sortedAndFilteredGoals = goals
      .filter(goal => goal.type && goal.amount)
      .filter(goal => goal.type === 'yearlyBudget')
      .filter(goal => goal.amount > balance)
      .sort((a, b) => a.amount - b.amount);

    return sortedAndFilteredGoals[0];
  };

  nextGoalPercentage = (recommendation) => {
    const balance = get(recommendation, 'opencollective.stats.balance', 0);
    const goal = this.nextGoal(recommendation);

    return goal ? Math.round(balance / goal.amount * 100) : null;
  };

  nextGoaltitle = (recommendation) => {
    const goal = this.nextGoal(recommendation);

    return get(goal, 'title', null);
  };

  backerItem = (backer) => (
    <span key={backer.id}>
      <a href={`https://opencollective.com/${backer.slug}`}>
        {backer.name}
      </a>
      &nbsp;
      <span>
        ({this.formatDonation(backer.totalDonations / 100)})
      </span>
    </span>
  );

  githubRepoItem = (repo) => (
    <span key={repo.id}>
      {repo.full_name &&
        <a href={`https://github.com/${repo.full_name}`}>{repo.name}</a>
      }
      {!repo.full_name &&
        <span>{repo.name}</span>
      }
    </span>
  );

  render () {
    const { recommendations } = this.props;

    return (
      <Fragment>
        <style jsx>{`
        .Recommendations {
          display: flex;
          flex-wrap: wrap;
        }

        .Recommendation {
          box-sizing: border-box;
          width: 290px;
          min-height: 500px;
          border-radius: 15px;
          background-color: #ffffff;
          border: 1px solid #c1c6cc;
          padding: 20px;
          margin-right: 30px;
          margin-bottom: 30px;
          position: relative;
          color: #2E3033;
          padding-bottom: 100px;
        }

        .Recommendation .logo {
          margin-bottom: 10px;
        }
        .Recommendation .logo img {
          border-radius: 12px;
          background: #cdcbca;
        }
        .Recommendation .name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .Recommendation .description {
          font-size: 13px;
          line-height: 19px;
          margin-bottom: 20px;
          min-height: 50px;
        }
        .Recommendation .repos, .Recommendation .backers {
          margin-bottom: 20px;
        }
        .Recommendation .repos, .Recommendation .backers {
          color: #6E747A;
        }
        .Recommendation .repos strong, .Recommendation .backers strong, .Recommendation .budget {
          font-weight: 500;
          color: #2E3033;
        }
        .Recommendation .repos a, .Recommendation .backers a {
          color: #6E747A;
        }
        .Recommendation .repos a:hover, .Recommendation .backers a:hover {
          color: inherit;
          text-decoration: none;
        }

        .secondPart {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          box-sizing: border-box;
          padding: 20px;
        }

        .contributeButton {
          box-sizing: border-box;
          border-radius: 6px;
          padding: 10px;
        }

        .andOthers .noWrap {
          white-space: nowrap;
        }
        .andOthers:before {
          content: "\00a0 ";
        }

        .noGoal {
          color: #6E747A;
          font-style: italic;
        }

        .meter {
          height: 4px;
          background: #EFECEA;
          border-radius: 2px;
          margin: 5px 0;
        }
        .meter span {
          display: block;
          height: 4px;
          background: #00B856;
          border-radius: 2px;
        }

        @media screen and (max-width:500px) {
          .Recommendation {
            width: 100%;
            margin: 0;
            margin-bottom: 20px;
            height: auto;
            min-height: 0;
          }
        }
        `}
        </style>

        <div className="Recommendations">
          {recommendations.filter(r => r.opencollective).map(recommendation => (
            <div key={recommendation.name} className="Recommendation">

              <div className="logo">
                <img
                  src={`https://opencollective.com/${recommendation.opencollective.slug}/logo.png?height=55`}
                  height="55"
                  />
              </div>

              <div className="name"><b>{recommendation.opencollective.name}</b></div>

              <div className="description">{recommendation.opencollective.description}</div>

              {recommendation.repos && recommendation.repos.length > 0 &&
                <div className="repos">
                  <strong>Used in</strong>:<br />
                  <List
                    array={recommendation.repos}
                    map={this.githubRepoItem}
                    cut={3}
                    />
                </div>
              }

              {recommendation.opencollective.sponsors && recommendation.opencollective.sponsors.length > 0 &&
                <div className="backers">
                  <strong>Backers</strong>:<br />
                  <List
                    array={recommendation.opencollective.sponsors}
                    map={this.backerItem}
                    cut={3}
                    />
                </div>
              }

              {recommendation.opencollective.stats.yearlyBudget > 0 &&
                <Fragment>
                  <div className="budget">
                    Yearly budget: {this.formatBudget(recommendation.opencollective.stats.yearlyBudget / 100)}
                  </div>
                  {this.nextGoal(recommendation) &&
                    <Fragment>
                      <div className="meter">
                        <span style={{ width: `${this.nextGoalPercentage(recommendation)}%` }}></span>
                      </div>
                      <div className="goal">
                        <strong>{this.nextGoalPercentage(recommendation)}%</strong> progress to reach their next goal:<br />
                        {this.nextGoaltitle(recommendation)}
                      </div>
                    </Fragment>
                  }
                </Fragment>
              }

              <div className="secondPart">
                <a className="bigButton contributeButton" href={`https://opencollective.com/${recommendation.opencollective.slug}`}>
                  Contribute
                </a>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  }

}
