import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import { get } from 'lodash';

import List from '../components/List';

export default class RecommendationCard extends React.Component {

  static propTypes = {
    recommendation: PropTypes.object.isRequired,
    opencollective: PropTypes.object,
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

  formatBackingAmount = (amount) => `${this.budgetFormatter.format(Math.round(amount))}`;

  formatBackingDate = (date) => moment(new Date(date)).format('MMM YYYY');

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

  getBackingData = (recommendation, opencollective) => (
    opencollective && opencollective.backing.find(membership =>
      recommendation.opencollective.id === membership.collective.id
    )
  );

  logoSrc = () => {
    const { recommendation } = this.props;

    if (recommendation.logo) {
      return recommendation.logo;
    } else {
      return `https://opencollective.com/${recommendation.opencollective.slug}/logo.png?height=55`;
    }
  };

  render () {
    const { recommendation, opencollective } = this.props;

    const backing = this.getBackingData(recommendation, opencollective);

    const backers = (recommendation.opencollective.sponsors || []).filter(backer =>
      !opencollective || opencollective.slug !== backer.slug
    );

    return (
      <Fragment>
        <style jsx>{`
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
        .Recommendation.backing {
          background: url("/static/img/sponsor-badge.png") no-repeat right top;
          background-size: 125px 125px;
        }

        .Recommendation .logo {
          margin-bottom: 10px;
        }
        .Recommendation .logo img {
          border-radius: 12px;
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

        .bigButton {
          box-sizing: border-box;
          border-radius: 6px;
          padding: 10px;
        }

        .backingButton small {
          font-size: 12px;
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

        <div className={classNames('Recommendation', { 'backing': !!backing })}>

          <div className="logo">
            <img src={this.logoSrc()} width="55" height="55" alt="" />
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

          {(backing || backers.length > 0) &&
            <div className="backers">
              <strong>Backers</strong>:<br />
              {backing &&
                <Fragment>
                  <a href={`https://opencollective.com/${opencollective.slug}`}>
                    {opencollective.name}
                  </a> ({this.formatBackingAmount(backing.stats.totalDonations / 100)} since {this.formatBackingDate(backing.createdAt)}).
                </Fragment>
              }
              {backing && backers.length > 0 &&
                <Fragment>{' Also: '}</Fragment>
              }
              {backers.length > 0 &&
                <List
                  array={backers}
                  map={this.backerItem}
                  cut={3}
                  />
              }
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

      </Fragment>
    );
  }

}
