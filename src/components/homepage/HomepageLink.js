import React, { Fragment } from 'react';

const HomepageLink = ({ type, style, mousePosition, ...props }) => {
  const { positionX, positionY } = mousePosition;

  return (
    <Fragment>
      <style jsx>
        {`
          .tryItNow {
            min-width: 130px;
            padding: 12px 24px;
            border: 2px solid #e69d9b;
            box-sizing: border-box;
            border-radius: 24px;
            outline: none;
            font-weight: bold;
            font-size: 14px;
            line-height: 16px;
            text-align: center;
            letter-spacing: -0.02em;
            color: #3c5869;
            text-decoration: none;
            white-space: nowrap;
          }
          .becomeATester {
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            color: #3c5869;
            text-decoration: none;
            width: 144px;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 24px;
          }
          .searchButton {
            margin: 10px auto;
            background: #3c5869;
            mix-blend-mode: normal;
            border-radius: 32px;
            outline: none;
            font-weight: bold;
            font-size: 12px;
            line-height: 16px;
            text-align: center;
            padding: 17px 4px;
            color: #fff;
            border: none;
            width: 229px;
            font-family: 'Fira Code';
            cursor: pointer;
          }
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
            cursor: pointer;
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
          .investSectionContribute {
            color: #7a9fb8;
            background: #fff;
          }
          .investSectionBecomePartner {
            color: #fff;
            border-color: #ffffff;
          }
          .joinUsbecomeAPartner,
          .joinUscontribute {
            margin-top: 8px;
            margin-bottom: 16px;
            width: 100%;
          }
          .OurValuesBecomeAPartner {
            margin-right: 5px;
            white-space: nowrap;
          }
          .joinBetaBtn {
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
            cursor: pointer;
            font-family: 'Fira Code';
          }
          .sendButton {
            border: 2px solid #ffffff;
            box-sizing: border-box;
            border-radius: 24px;
            padding: 12px 24px;
            font-weight: bold;
            font-size: 14px;
            line-height: 16px;
            text-align: center;
            letter-spacing: -0.02em;
            color: #fffef9;
            background: transparent;
            min-width: 100%;
            cursor: pointer;
          }
          .sendButton:focus {
            outline: none;
          }
          .sendButton:disabled {
            background: #7a9fb8;
            border: 2px solid #ffffff;
            box-sizing: border-box;
          }
          .failed:disabled {
            background: #f55882;
          }
          .secondary:hover {
            background-image: url('/static/img/homepage/secondary-btn-bg.svg');
            background-size: 48px 48px;
            background-position: ${positionX}px ${positionY}px;
            background-repeat: no-repeat;
            background-color: #d4796e;
            border: 2px solid #d4796e;
          }
          .joinBetaBtn:hover {
            background-image: url('/static/img/homepage/joinBeta-bg.svg');
            background-size: 48px 48px;
            background-position: ${positionX}px ${positionY - 15}px;
            background-repeat: no-repeat;
          }
          .secondary:enabled {
            background-color: #e69d9b;
          }
          .secondary:disabled {
            background-color: #9399a3;
          }

          .OurValuesContribute:hover,
          .primary:hover {
            background-image: url('/static/img/homepage/primary-btn-bg.svg');
            background-position: ${positionX}px ${positionY}px;
            background-repeat: no-repeat;
            background-size: 48px 48px;
          }
          .searchButton:hover {
            background-image: url('/static/img/homepage/primary-btn-bg.svg');
            background-position: ${positionX}px ${positionY - 20}px;
            background-repeat: no-repeat;
            background-size: 48px 48px;
          }
          .primary:disabled {
            background-color: #9399a3;
          }
          .investSectionBecomePartner:hover,
          .investSectionContribute:hover {
            background-image: url('/static/img/homepage/contribute-btn-bg.svg');
            background-size: 48px 48px;
            background-position: ${positionX}px ${positionY}px;
            background-repeat: no-repeat;
          }
          .sendButton:hover,
          .joinUscontribute:hover,
          .joinUsbecomeAPartner:hover {
            background-image: url('/static/img/homepage/primary-btn-bg.svg');
            background-size: 48px 48px;
            background-position: ${positionX}px ${positionY - 20}px;
            background-repeat: no-repeat;
          }
          @media screen and (min-width: 768px) {
            .tryItNow,
            .investSectionBecomePartner {
              margin-right: 30px;
            }
            .becomeATester {
              padding: 16px 53px;
            }
            .becomeATester:hover {
              border-color: #3c5869;
            }
            .joinBetaBtn {
              width: 154px;
            }
            .sendButton {
              align-self: flex-end;
              min-width: 82px;
            }
          }
          @media screen and (min-width: 1194px) {
            .searchButton {
              font-size: 14px;
              line-height: 16px;
              text-align: center;
              letter-spacing: -0.02em;
              min-width: 260px;
              padding: 15px 4px;
            }
          }
        `}
      </style>
      {type === 'button' || type === 'submit' ? (
        <button type={type} {...props}>
          {props.children}
        </button>
      ) : (
        <a {...props}>{props.children}</a>
      )}
    </Fragment>
  );
};

export default HomepageLink;
