import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const BackMyStack = ({ onClickBackMyStack, saving }) => {
  return (
    <Fragment>
      <style jsx>
        {`
          .backMyStackWrapper {
            margin-bottom: 20px;
            width: 100%;
            border-radius: 15px;
            padding: 20px;
            box-sizing: border-box;
            background: url('/static/img/backmystack-banner.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
          .backMyStackInfoWrapper {
            width: 60%;
            color: #fff;
          }
          .newText {
            color: #ffc94d;
            font-weight: 600;
            font-size: 20px;
            line-height: 20px;
            margin-bottom: 20px;
          }
          .backMyStackInfoWrapper h2 {
            margin: 0;
            font-weight: 900;
            font-size: 32px;
            line-height: 36px;
            letter-spacing: -0.4px;
          }
          .backMyStackInfoWrapper p {
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
          }
          .backMyStackBtn {
            background: #2c2c85;
            font-size: 14px;
            line-height: 21px;
            outline: none;
            cursor: pointer;
          }
          @media screen and (max-width: 768px),
            @media screen and (max-width: 500px) {
            .backMyStackWrapper {
              background: url('/static/img/mobile-backmystack-banner.png');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              width: 100%;
            }
            .backMyStackInfoWrapper {
              width: 78%;
            }
            .backMyStackInfoWrapper h2 {
              margin: 0;
              font-weight: bold;
              font-size: 24px;
              line-height: 28px;
              letter-spacing: -0.4px;
            }
            .backMyStackInfoWrapper p {
              font-size: 14px;
              line-height: 22px;
              letter-spacing: -0.2px;
              font-weight: 300;
            }
            .newText {
              margin-bottom: 20px;
            }
          }
          @media screen and (max-width: 768px),
            @media screen and (max-width: 500px) {
            .backMyStackWrapper {
              background: url('/static/img/mobile-backmystack-banner.png');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              width: 100%;
            }
            .backMyStackInfoWrapper {
              width: 78%;
            }
            .backMyStackInfoWrapper h2 {
              margin: 0;
              font-weight: bold;
              font-size: 24px;
              line-height: 28px;
              letter-spacing: -0.4px;
            }
            .backMyStackInfoWrapper p {
              font-size: 14px;
              line-height: 22px;
              letter-spacing: -0.2px;
              font-weight: 300;
            }
            .newText {
              margin-bottom: 20px;
            }
          }
          .backMyStackBtn:hover {
            opacity: 0.8;
          }
          .backMyStackBtn:disabled {
            opacity: 0.8;
            cursor: default;
          }
          @media screen and (max-width: 768px),
            @media screen and (max-width: 500px) {
            .backMyStackWrapper {
              background: url('/static/img/mobile-backmystack-banner.png');
              background-size: 100% 100%;
              background-repeat: no-repeat;
              width: 100%;
            }
            .backMyStackInfoWrapper {
              width: 78%;
            }
            .backMyStackInfoWrapper h2 {
              margin: 0;
              font-weight: bold;
              font-size: 24px;
              line-height: 28px;
              letter-spacing: -0.4px;
            }
            .backMyStackInfoWrapper p {
              font-size: 14px;
              line-height: 22px;
              letter-spacing: -0.2px;
              font-weight: 300;
            }
            .newText {
              margin-bottom: 20px;
            }
          }
        `}
      </style>
      <div className="backMyStackWrapper">
        <div className="backMyStackInfoWrapper">
          <h3 className="newText">New!</h3>
          <h2>Automatically back your stack every month</h2>
          <p>
            Set up a monthly subscription and we will automatically distribute
            the funds among your dependencies on Open Collective!
          </p>
          <button
            className="bigButton backMyStackBtn"
            onClick={onClickBackMyStack}
            disabled={saving}
          >
            Back My Stack
          </button>
        </div>
      </div>
    </Fragment>
  );
};

BackMyStack.propTypes = {
  onClickBackMyStack: PropTypes.func,
  saving: PropTypes.bool,
};

export default BackMyStack;
