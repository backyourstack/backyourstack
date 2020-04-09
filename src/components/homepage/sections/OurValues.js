import React, { Fragment } from 'react';

const OurValues = () => (
  <Fragment>
    <style jsx global>
      {`
        .becomeAPartner {
          padding: 12px 24px;
          border: 2px solid #3c5869;
          box-sizing: border-box;
          border-radius: 24px;
          text-decoration: none;
          font-weight: bold;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          letter-spacing: -0.02em;
          color: #3c5869;
          white-space: nowrap;
        }
        .contribute {
          padding: 16px;
          background: #3c5869;
          mix-blend-mode: normal;
          border-radius: 32px;
          text-decoration: none;
          font-weight: bold;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
      `}
    </style>
    <style jsx>
      {`
        .container {
          margin-left: 19px;
          margin-right: 19px;
        }
        .wrapper {
          margin-bottom: 35px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .titleWrapper h2 {
          font-weight: bold;
          font-size: 32px;
          line-height: 40px;
          text-align: center;
          color: #3c5869;
        }
        .titleWrapper p {
          font-size: 20px;
          line-height: 24px;
          text-align: center;
          letter-spacing: -0.02em;
          color: #3c5869;
        }
        .values {
          display: flex;
          box-sizing: border-box;
          flex-direction: column;
          align-items: center;
        }
        .value {
          box-sizing: border-box;
          width: 282px;
          margin-bottom: 20px;
        }
        .value h3 {
          font-weight: bold;
          font-size: 20px;
          line-height: 24px;
          letter-spacing: -0.02em;
          color: #3c5869;
        }
        .value p {
          font-size: 16px;
          line-height: 24px;
          color: #3c5869;
          margin-bottom: 25px;
        }
        .authenticity,
        .goodCitizen,
        .resiliency {
          border-bottom: 1px solid #799fb8;
        }
        .actionWrapper {
          margin-top: 28px;
          margin-bottom: 42px;
        }
        .partners {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
          align-items: center;
          justify-content: space-between;
        }
        .partner {
          margin: 5px 10px;
        }
        .becomeAPartner {
          margin-right: 5px;
          white-space: nowrap;
        }
        .title h2 {
          font-size: 20px;
          line-height: 24px;
          letter-spacing: -0.02em;
          color: #3c5869;
        }
        .description p {
          font-size: 20px;
          line-height: 24px;
          letter-spacing: -0.02em;
          color: #3c5869;
        }
        .openSourceTogetherWrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
        }
        .horizontalDivider,
        .verticalDivider {
          display: none;
        }
        @media screen and (min-width: 375px) {
          .titleWrapper {
            width: 310px;
          }
          .title,
          .description {
            width: 288px;
          }
          .partner {
            margin: 5px 23px;
          }
        }
        @media screen and (min-width: 768px) {
          .titleWrapper {
            width: 682px;
          }
          .values {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .value {
            margin-bottom: 0;
          }
          .resiliency h3,
          .simplicity h3 {
            margin-top: 15px;
          }
          .authenticity,
          .goodCitizen,
          .resiliency {
            border-bottom: none;
          }
          .verticalDivider {
            display: block;
            height: 190px;
            border-right: 1px solid #799fb8;
            margin-left: 25px;
            margin-right: 35px;
          }
          .horizontalDivider {
            display: block;
            width: 690px;
            border-bottom: 1px solid #799fb8;
          }
          .openSourceTogetherWrapper {
            margin-top: 100px;
            align-items: flex-start;
            margin-left: 55px;
          }
          .title {
            width: 547px;
          }
          .title h2 {
            font-size: 56px;
            line-height: 64px;
            letter-spacing: -0.02em;
          }
          .description {
            width: 520px;
          }
          .contribute {
            margin-left: 25px;
          }
          .partners {
            width: 500px;
            margin-top: 50px;
            margin-bottom: 50px;
            justify-content: flex-start;
          }
          .topValues,
          .bottomValues {
            display: flex;
          }
        }
        @media screen and (min-width: 1194px) {
          .titleWrapper {
            width: 700px;
          }

          .titleWrapper h2 {
            font-size: 56px;
            line-height: 64px;
            margin-bottom: 30px;
          }
          .value {
            width: 405px;
          }
          .topValues,
          .bottomValues {
            display: flex;
            justify-content: space-around;
            align-items: center;
          }
          .horizontalDivider {
            width: 1000px;
          }
          .verticalDivider {
            margin-left: 50px;
            margin-right: 50px;
          }
          .openSourceTogetherWrapper {
            flex-direction: row;
            justify-content: center;
            margin-bottom: 50px;
          }
          .partners {
            justify-content: center;
          }
          .actionWrapper {
            margin-top: 50px;
          }
        }
        @media screen and (min-width: 1440px) {
          .description {
            width: 674px;
          }
          .titleDescriptionWrapper {
            margin-right: 30px;
          }
          .partners {
            margin-left: 100px;
            margin-right: 100px;
          }
        }
      `}
    </style>
    <div className="container">
      <div className="wrapper">
        <div className="titleWrapper">
          <h2>Our values</h2>
          <p>
            We believe that open source technologies are a shared
            infrastructure. It is our responsibility to bridge businesses with
            the open source communities they depend on. Our work carries the
            following values:
          </p>
        </div>
      </div>
      <div className="values">
        <div className="topValues">
          <div className="value authenticity">
            <h3>Authenticity</h3>
            <p>
              With integrity and transparency, we are building a world where
              open source can thrive.{' '}
            </p>
          </div>
          <div className="verticalDivider"></div>
          <div className="value goodCitizen">
            <h3>Good Citizenship</h3>
            <p>
              We believe corporations propel the promise of open source. We
              build bridges of collaboration and mutual benefit.{' '}
            </p>
          </div>
        </div>
        <div className="horizontalDivider"></div>
        <div className="bottomValues">
          <div className="value resiliency">
            <h3>Resiliency</h3>
            <p>
              Open source is bigger than a single person. We embrace the
              strength that grows from working together.
            </p>
          </div>
          <div className="verticalDivider"></div>
          <div className="value simplicity">
            <h3>Simplicity</h3>
            <p>
              We believe investing in open source should not be difficult. We
              remove friction to grow with simplicity.{' '}
            </p>
          </div>
        </div>
      </div>
      <div className="openSourceTogetherWrapper">
        <div className="titleDescriptionWrapper">
          <div className="title">
            <h2>Building open source together.</h2>
          </div>
          <div className="description">
            <p>
              We are on a mission to shape the best tools and dialogue about the
              business of open source sustainability. Our members range from
              for-profit technology companies to non-profits’ voices. Come join
              us.
            </p>
          </div>
          <div className="actionWrapper">
            <a href="#" className="becomeAPartner">
              Become a partner
            </a>
            <a href="#" className="contribute">
              Contribute
            </a>
          </div>
        </div>
        <div className="partners">
          <div className="partner">
            <a href="#">
              <img
                src="/static/img/homepage/oc-partner.svg"
                alt="Open collective"
              />
            </a>
          </div>
          <div className="partner">
            <a href="#">
              <img
                src="/static/img/homepage/osi-partner.svg"
                alt="Open source initative"
              />
            </a>
          </div>
          <div className="partner">
            <a href="#">
              <img
                src="/static/img/homepage/osc-partner.svg"
                alt="Open source collective"
              />
            </a>
          </div>
          <div className="partner">
            <a href="#">
              <img src="/static/img/homepage/cf-partner.svg" alt="Code fund" />
            </a>
          </div>
          <div className="partner">
            <a href="#">
              <img src="/static/img/homepage/last-partner.svg" alt="Partner" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

export default OurValues;
