import React, { Fragment } from 'react';

const features = [
  {
    title: 'Report',
    description:
      'Output a report with a hierarchy of the open source projects in your development stack.',
  },
  {
    title: 'Analize',
    description:
      'Scan your project for JavaScript, PHP, .NE, Go, Ruby and Python dependencies.',
  },
  {
    title: 'Choose',
    description:
      'Decide which open source projects are most important to your business needs.',
  },
  {
    title: 'Contribute',
    description:
      'Sign-up for a single contribution or monthly subscription across your portfolio of open source.',
  },
  {
    title: 'Connect',
    description:
      'Directly connect with the communities behind your open source projects.  See the difference your investment makes.',
  },
];

const WhatIsBackyourstack = () => (
  <Fragment>
    <style jsx>
      {`
        .container {
          margin-left: 19px;
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
          width: 130px;
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
        }
        .featureWrapper {
          display: flex;
          align-items: center;
        }
        .feature {
          box-shadow: 0px 4px 8px rgba(20, 20, 20, 0.16);
          padding: 5px;
        }
        .feature h2 {
          font-size: 32px;
          line-height: 40px;
          color: #3c5869;
          margin-bottom: 16px;
        }
        .feature p {
          font-size: 16px;
          line-height: 24px;
          color: #3c5869;
          margin-top: 32px;
        }
        .report {
          position: relative;
          width: 147px;
          height: 180px;
          left: 100px;
          top: 80px;
        }
        .leftNavigator,
        .rightNavigator {
          position: relative;
          top: 100px;
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
          .becomeATester {
            margin-left: 38px;
          }
        }
        @media screen and (min-width: 1194px) {
          .container {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
          }
          .titleWrapper {
            width: 520px;
          }
          .titleWrapper h2 {
            font-size: 56px;
            line-height: 64px;
            letter-spacing: -0.02em;
          }
        }
        @media screen and (min-width: 1440px) {
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
          <a className="tryItNow" href="#">
            Try it now
          </a>
          <a className="becomeATester" href="#">
            Become a beta tester
          </a>
        </div>
      </div>
      <div className="carouselWrapper">
        <div className="featureWrapper">
          <div className="leftNavigator">
            <img
              src="/static/img/homepage/left-navigator.svg"
              alt="Left Navigator"
            />
          </div>
          <div>
            <img
              src="/static/img/homepage/Report-bg.svg"
              alt="Report"
              className="report"
            />
            <div className="feature">
              <h2>Reports</h2>
              <p>
                Output a report with a hierarchy of the open source projects in
                your development stack.
              </p>
            </div>
          </div>
          <div className="rightNavigator">
            <img
              src="/static/img/homepage/right-navigator.svg"
              alt="Left Navigator"
            />
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

export default WhatIsBackyourstack;
