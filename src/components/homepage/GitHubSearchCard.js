import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import GithubLogo from '../../static/img/homepage/github-icon.svg';
import SearchForm from '../../components/SearchForm';

const GitHubSearchCard = ({ loggedInUserOrgs }) => (
  <Fragment>
    <style jsx>
      {`
        p {
          font-family: 'Inter UI', sans-serif;
        }
        .box {
          width: 266px;
          display: flex;
          flex-direction: column;
          min-height: 321px;
          background: #fff;
          box-shadow: 0px 4px 8px rgba(20, 20, 20, 0.16);
          border-radius: 8px;
          padding: 26px 17px;
          box-sizing: border-box;
        }
        .boxHeader {
          display: flex;
          align-items: center;
          color: #3c5869;
          font-size: 16px;
          line-height: 24px;
        }
        .boxHeader h3 {
          font-weight: 400;
        }
        .icon {
          margin-right: 20px;
          width: 20px;
          height: 20px;
        }
        .boxDescription {
          font-size: 12px;
          line-height: 16px;
          letter-spacing: -0.016em;
          color: rgba(39, 39, 48, 0.5);
        }
        @media screen and (min-width: 375px) {
          .box {
            width: 322px;
          }
        }
        @media screen and (min-width: 768px) {
          .box {
            height: 321px;
            width: 352px;
            padding: 20px 17px;
          }
        }
        @media screen and (min-width: 1194px) {
          .box {
            height: 368px;
            width: 416px;
            padding: 20px 40px;
            justify-content: space-between;
          }
          .boxDescription {
            font-size: 14px;
            line-height: 24px;
            letter-spacing: -0.012em;
          }
        }
      `}
    </style>
    <div className="box">
      <div className="boxHeader">
        <div className="icon">
          <GithubLogo />
        </div>
        <h3>Use a GitHub profile</h3>
      </div>
      <p className="boxDescription">
        Just copy and paste the URL of the repository that you want to scan and
        set a contribution.
      </p>
      <SearchForm orgs={loggedInUserOrgs} />
      <p className="boxDescription">
        Or try analyzing non-public repositories by uploading dependency files
        here.
      </p>
    </div>
  </Fragment>
);

GitHubSearchCard.propTypes = {
  loggedInUserOrgs: PropTypes.array,
};

export default GitHubSearchCard;
