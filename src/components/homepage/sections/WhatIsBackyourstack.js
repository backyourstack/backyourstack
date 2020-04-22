import React, { Fragment } from 'react';

import FeatureCarousel from '../FeatureCarousel';
import MouseTracker from '../MouseTracker';
import HomepageLink from '../HomepageLink';

const WhatIsBackyourstack = () => (
  <Fragment>
    <style jsx>
      {`
        .mainWrapper {
          display: flex;
          flex-direction: column;
        }
        .container {
          margin-left: 15px;
          margin-right: 15px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          margin-top: 72px;
        }
        .titleWrapper {
          margin-bottom: 5px;
        }
        .xl {
          display: none;
        }
        .titleWrapper h2 {
          font-weight: bold;
          font-size: 32px;
          line-height: 40px;
          color: #3c5869;
        }
        .description {
          font-size: 16px;
          line-height: 24px;
          color: #3c5869;
        }
        .actionWrapper {
          margin-top: 32px;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .tryItNow {
          min-width: 130px;
          padding: 16px 24px;
          border: 2px solid #e69d9b;
          box-sizing: border-box;
          border-radius: 24px;
          border-radius: 24px;
          outline: none;
          font-weight: bold;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          letter-spacing: -0.02em;
          color: #3c5869;
          text-decoration: none;
          margin-right: 10px;
          white-space: nowrap;
        }
        .becomeATester {
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
          color: #3c5869;
          text-decoration: none;
          width: 144px;
        }
        .carouselWrapper {
          margin-top: 24px;
          margin-bottom: 24px;
          width: 100%;
        }
        @media screen and (min-width: 375px) {
          .container {
            margin-left: 32px;
            margin-right: 32px;
          }
          .titleWrapper,
          .descriptionWrapper {
            width: 307px;
          }
        }
        @media screen and (min-width: 768px) {
          .container {
            margin-left: 76px;
            margin-right: 76px;
          }
          .descriptionWrapper {
            width: 415px;
          }
          .carouselWrapper {
            width: 70%;
            align-self: center;
          }
        }
        @media screen and (min-width: 1024px) {
          .carouselWrapper {
            width: 50%;
          }
        }
        @media screen and (min-width: 1194px) {
          .mainWrapper {
            flex-direction: row;
          }
          .container {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            margin-left: 50px;
            margin-right: 50px;
          }
          .titleWrapper {
            width: 520px;
          }
          .titleWrapper h2 {
            font-size: 56px;
            line-height: 64px;
            letter-spacing: -0.02em;
          }
          .carouselWrapper {
            width: 544px;
            margin-right: 57px;
          }
        }
        @media screen and (min-width: 1440px) {
          .mainWrapper {
            justify-content: center;
          }
          .container {
            margin-left: 76px;
            margin-right: 76px;
          }
          .carouselWrapper {
            margin-right: 50px;
            margin-left: 50px;
          }
          .titleWrapper,
          .descriptionWrapper {
            width: 636px;
          }
          .xl {
            display: block;
          }
        }
      `}
    </style>
    <div className="mainWrapper">
      <div className="container">
        <div className="wrapper">
          <div className="titleWrapper">
            <h2 className="title">
              What is <br className="xl" /> Back Your Stack?
            </h2>
          </div>
          <div className="descriptionWrapper">
            <p className="description">
              Back Your Stack works by analyzing your project manifests and
              finding all of your dependencies. We then empower you to curate a
              subscription plan and see the impact of your contribution.
            </p>
          </div>
          <div className="actionWrapper">
            <MouseTracker
              render={mousePosition => (
                <HomepageLink
                  className="tryItNow secondary"
                  href="#"
                  mousePosition={mousePosition}
                >
                  Try it now
                </HomepageLink>
              )}
            />
            <MouseTracker
              style={{}}
              render={mousePosition => (
                <HomepageLink
                  className="becomeATester primary"
                  href="#"
                  mousePosition={mousePosition}
                >
                  Become a beta tester
                </HomepageLink>
              )}
            />
          </div>
        </div>
      </div>
      <div className="carouselWrapper">
        <FeatureCarousel />
      </div>
    </div>
  </Fragment>
);

export default WhatIsBackyourstack;
