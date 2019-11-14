import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const BackMyStackCompanyBanner = ({ name }) => {
  return (
    <Fragment>
      <style jsx>
        {`
          .companyBannerWrapper {
            margin-bottom: 20px;
            width: 100%;
            border-radius: 15px;
            padding: 20px;
            box-sizing: border-box;
            background: url('/static/img/company-banner.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            height: 274px;
          }
          .companyBannerTextWrapper {
            color: #fff;
            padding-left: 20px;
            width: 45%;
          }
          .companyBannerTextWrapper h2 {
            font-weight: 900;
            font-size: 32px;
            line-height: 36px;
            letter-spacing: -0.4px;
          }
          .companyBannerTextWrapper p {
            font-weight: 500;
            font-size: 16px;
            line-height: 26px;
            letter-spacing: -0.012em;
            margin: 0;
          }
          .buttonWrapper {
            width: 169px;
          }
          .backMyStackBtn {
            background: #5c48e0;
            font-size: 14px;
            line-height: 21px;
            outline: none;
            cursor: pointer;
            border-radius: 6px;
            margin-top: 28px;
            padding: 12px 16px;
          }
          .backMyStackBtn:hover {
            opacity: 0.8;
          }
          .backMyStackBtn:disabled {
            opacity: 0.8;
            cursor: default;
          }
          @media screen and (max-width: 1024px),
            @media screen and (max-width: 768px) {
            .companyBannerWrapper {
              padding: 1px;
            }
            .companyBannerTextWrapper h2 {
              font-size: 28px;
              line-height: 30px;
              margin-bottom: 10px;
            }
            .backMyStackBtn {
              margin-top: 8px;
            }
          }
        `}
      </style>
      <div className="companyBannerWrapper">
        <div className="companyBannerTextWrapper">
          <h2>
            {name}
            <br />
            is backing their stack!
          </h2>
          <p>
            Backing 234 dependencies with a $1000 monthly budget. $5000 donated
            so far.
          </p>
          <div className="buttonWrapper">
            <a className="bigButton backMyStackBtn" href="/">
              Back Your Stack too
            </a>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

BackMyStackCompanyBanner.propTypes = {
  name: PropTypes.string.isRequired,
};

export default BackMyStackCompanyBanner;
