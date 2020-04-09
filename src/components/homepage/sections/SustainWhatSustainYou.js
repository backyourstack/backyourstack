import React, { Fragment } from 'react';

const SustainWhatSustainYou = () => (
  <Fragment>
    <style jsx>
      {`
        .container {
          display: flex;
          width: 100%;
          flex-direction: column;
        }
        .titleWrapper {
          background-image: url('/static/img/homepage/sustainwhatsustainyou-xs-bg.svg');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          height: 542px;
        }
        .titleContainer,
        .descriptionWrapper {
          margin-left: 18px;
          margin-right: 24px;
          width: 277px;
          height: 256px;
        }
        .title {
          font-weight: bold;
          font-size: 56px;
          line-height: 64px;
          letter-spacing: -0.02em;
          color: #3c5869;
        }
        .descriptionWrapper {
          height: 216px;
          margin-top: 32px;
        }
        .description {
          font-weight: normal;
          font-size: 16px;
          line-height: 24px;
          color: #3c5869;
        }
        .formWrapper {
          background-image: url('/static/img/homepage/joinbeta-xs-bg.svg');
          background-repeat: no-repeat;
          background-size: 192px 100%;
          background-position-y: 2px;
          height: 78px;
          margin-top: 48px;
          margin-bottom: 48px;
        }
        form {
          display: flex;
          width: 100%;
          margin-right: 3px;
          margin-left: 3px;
        }
        input {
          width: 192px;
          background: #f7f8fa;
          padding: 12px 52px 12px 24px;
          outline: none;
          border: none;
          border-radius: 24px 0px 0px 24px;
          font-size: 12px;
          line-height: 16px;
          color: #9d9fa3;
        }
        input::-webkit-input-placeholder {
          /* Chrome/Opera/Safari */
          font-family: 'Fira Code', monospace;
          font-weight: 400;
        }
        input::-moz-placeholder {
          /* Firefox 18- */
          font-family: 'Fira Code', monospace;
          font-weight: 400;
        }
        button {
          width: 123px;
          outline: none;
          background: #e69d9b;
          border-radius: 0px 24px 24px 0px;
          font-weight: bold;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          letter-spacing: -0.02em;
          color: #ffffff;
          white-space: nowrap;
          padding: 12px 8px;
          border: none;
        }
        .partnersWrapper {
          margin-left: 27px;
          margin-right: 27px;
        }
        .partnersWrapper h3 {
          font-weight: normal;
          font-size: 16px;
          line-height: 16px;
          text-align: center;
          color: #acbdc7;
          margin-bottom: 30px;
        }
        .partners {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-around;
          margin-top: 30px;
        }
        .backgroundGraphics {
          display: none;
        }
        @media screen and (min-width: 375px) {
          .titleWrapper {
            background-image: url('/static/img/homepage/sustainwhatsustainyou-sm-bg.svg');
            background-repeat: no-repeat;
            height: 625px;
          }
          .titleContainer,
          .descriptionWrapper {
            margin-left: 31px;
            margin-right: 31px;
            width: 307px;
            height: 192px;
          }
          .formWrapper {
            margin-left: 13px;
            margin-right: 47px;
          }
        }
        @media screen and (min-width: 768px) {
          .wrapper {
            background-image: url('/static/img/homepage/sustainwhatsustainyou-md-bg.svg');
            background-repeat: no-repeat;
            background-position: right bottom;
            height: 740px;
            margin-bottom: 50px;
          }
          .titleContainer,
          .descriptionWrapper {
            width: 452px;
          }
          .titleWrapper {
            background-image: none;
            height: 128px;
          }
          .descriptionWrapper {
            margin-bottom: 0;
            height: 140px;
          }
          .formWrapper {
            margin-top: 0;
          }
          input {
            width: 212px;
          }
          button {
            width: 154px;
          }
          .backgroundGraphics {
            display: flex;
            justify-content: right;
            flex-direction: row-reverse;
            position: relative;
            top: -150px;
          }
          .md {
            display: block;
          }
          .lg {
            display: none;
          }
          .formWrapper,
          .descriptionWrapper {
            margin-left: 31px;
          }
        }
        @media screen and (min-width: 834px) {
          input {
            width: 262px;
          }
          button {
            width: 134px;
          }
        }
        @media screen and (min-width: 1024px) {
          .titleAndFormWrapper {
            margin-left: 45px;
          }
        }
        @media screen and (min-width: 1194px) {
          .wrapper {
            background-image: url('/static/img/homepage/sustainwhatsustainyou-lg-bg.svg');
            background-repeat: no-repeat;
            background-position: right bottom;
            height: 600px;
          }

          .titleWrapper {
            height: 144px;
          }
          .descriptionWrapper {
            height: 170px;
          }
          .titleContainer,
          .descriptionWrapper {
            width: 612px;
          }
          .title {
            font-size: 64px;
            line-height: 72px;
            letter-spacing: -0.02em;
          }
          .description {
            font-size: 20px;
            line-height: 150%;
            letter-spacing: -0.02em;
          }
          .formWrapper {
            background-position-x: 50px;
          }
          input {
            width: 312px;
          }
        }
        @media screen and (min-width: 1440px) {
          .wrapper {
            background-image: url('/static/img/homepage/sustainwhatsustainyou-xl-bg.svg');
            background-repeat: no-repeat;
            background-position: right bottom;
          }
          .titleContainer,
          .descriptionWrapper {
            width: 674px;
          }
          button {
            width: 184px;
          }
          .partners {
            justify-content: center;
          }
          .partners a {
            margin-left: 30px;
            margin-right: 30px;
          }
        }
        @media screen and (min-width: 2560px) {
          .wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            position: relative;
            left: -430px;
          }
        }
      `}
    </style>
    <div className="container">
      <div className="wrapper">
        <div className="titleAndFormWrapper">
          <div className="titleWrapper">
            <div className="titleContainer">
              <h1 className="title">Sustain what sustains you.</h1>
            </div>
          </div>
          <div className="descriptionWrapper">
            <p className="description">
              Sustain the open source ecosystem your company depends on.
              BackYourStack analyzes your open source software dependencies to
              find which projects you rely on, and then provides a way for you
              to easily support them all.
            </p>
          </div>
          <div className="formWrapper">
            <form className="form">
              <input type="email" name="email" placeholder="Enter your email" />
              <button type="submit">Join the Beta</button>
            </form>
          </div>
        </div>
      </div>
      <div className="partnersWrapper">
        <h3>We’re open source together</h3>
        <div className="partners">
          <a href="#">
            <img
              src="/static/img/homepage/OSC.svg"
              alt="Open source collective"
            />
          </a>
          <a href="#">
            <img src="/static/img/homepage/OC.svg" alt="Open collective" />
          </a>
          <a href="#">
            <img src="/static/img/homepage/Codefund.svg" alt="Code Fund" />
          </a>
        </div>
      </div>
    </div>
  </Fragment>
);

export default SustainWhatSustainYou;
