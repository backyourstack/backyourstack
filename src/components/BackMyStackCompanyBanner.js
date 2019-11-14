import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get, uniq, intersection } from 'lodash';

const getTotalDonations = opencollectiveAccount => {
  const orders = get(opencollectiveAccount, 'orders.nodes', []);
  const backyourstackOrder = orders.find(
    node => node.toAccount.slug === 'backyourstack',
  );
  return backyourstackOrder.totalDonations.value;
};

const getTotalBacking = (opencollectiveAccount, recommendations) => {
  const orders = get(opencollectiveAccount, 'orders.nodes', []);
  const recommendationsSlugs = recommendations
    .filter(r => r.opencollective)
    .map(r => r.opencollective.slug);
  const orderSlugs = uniq(orders.map(order => order.toAccount.slug));
  const backing = intersection(recommendationsSlugs, orderSlugs);
  return backing.length;
};

const BackMyStackCompanyBanner = ({
  profile,
  order,
  recommendations,
  opencollectiveAccount,
}) => {
  const totalDonations = getTotalDonations(opencollectiveAccount);
  const totalBacking = getTotalBacking(opencollectiveAccount, recommendations);
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
            {profile.name}
            <br />
            are backing their stack!
          </h2>
          <p>
            Backing {totalBacking} dependencies with a $
            {Math.round(order.totalAmount / 100, 2)} monthly budget.
            <br />
            {totalDonations && (
              <span>
                ${Math.round(order.totalAmount / 100, 2)} donated so far.
              </span>
            )}
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
  profile: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  recommendations: PropTypes.object.isRequired,
  opencollectiveAccount: PropTypes.object,
};

export default BackMyStackCompanyBanner;
