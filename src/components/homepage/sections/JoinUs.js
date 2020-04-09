import React, { Fragment } from 'react';

const JoinUs = () => (
  <Fragment>
    <style jsx>
      {`
        .backgroundWrapper {
          background-color: #7a9fb8;
          background-image: url('/static/img/homepage/joinus-bg.svg');
          background-repeat: no-repeat;
          background-position: right top;
          padding-bottom: 30px;
          padding-top: 100px;
        }
        .container {
          margin-right: 18px;
          margin-left: 18px;
          padding-top: 90px;
          padding-bottom: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .joinUsWrapper {
          box-sizing: border-box;
          width: 283px;
          height: 335px;
          padding: 42px 15px 35px;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 29px;
        }
        .joinUsWrapper h2 {
          font-weight: bold;
          font-size: 32px;
          line-height: 40px;
          text-align: center;
          color: #3c5869;
        }
        .actionWrapper {
          width: 252px;
        }
        .becomeAPartner,
        .contribute {
          display: block;
          margin-top: 8px;
          margin-bottom: 16px;
        }
        .soical-icons {
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .soical-icons a {
          margin-right: 10px;
          margin-left: 10px;
        }
        .contactUsWrapper {
          background-color: #3c5869;
          padding: 46px 37px;
          display: flex;
          justify-content: center;
          box-sizing: border-box;
        }
        .contactUsForm {
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .contactUsForm h3 {
          font-weight: bold;
          font-size: 32px;
          line-height: 40px;
          color: #fffef9;
        }
        form {
          width: 229px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        form input {
          background: #fffef9;
          border-radius: 8px;
          padding: 17px 24px;
          margin-bottom: 24px;
          font-weight: 500;
          font-size: 16px;
          line-height: 21px;
          color: #3c5869;
          outline: none;
          border: none;
        }
        textarea {
          outline: none;
          border: none;
          background: #fffef9;
          border-radius: 8px;
          font-weight: 500;
          font-size: 16px;
          line-height: 21px;
          color: #3c5869;
          padding: 24px;
          height: 168px;
          margin-bottom: 24px;
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
          width: 82px;
        }
        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          /* Chrome/Opera/Safari */
          font-family: 'Fira Code', monospace;
          font-weight: 400;
        }
        input::-moz-placeholder,
        textarea::-moz-placeholder {
          /* Firefox 18- */
          font-family: 'Fira Code', monospace;
          font-weight: 400;
        }
        @media screen and (min-width: 768px) {
          .joinUsWrapper {
            width: 441px;
            height: 488px;
          }
          .joinUsWrapper h2 {
            font-size: 56px;
            line-height: 64px;
            text-align: center;
            letter-spacing: -0.02em;
            margin-bottom: 54px;
          }
          .contribute {
            margin-bottom: 93px;
          }
          .contactUsWrapper {
            width: 600px;
          }
          .contactUsForm h3 {
            margin-bottom: 20px;
          }
          form,
          .contactUsForm {
            width: 458px;
          }
          form input {
            width: 336px;
          }
          textarea {
            width: 405px;
          }
          .sendButton {
            align-self: flex-end;
          }
        }
        @media screen and (min-width: 1194px) {
          .backgroundWrapper {
            padding-top: 140px;
          }
          .container {
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
          }
          .joinUsWrapper {
            height: 525px;
            width: 390px;
            margin-right: 10px;
          }
          .contactUsWrapper {
            margin-left: 30px;
          }
        }
        @media screen and (min-width: 1440px) {
          .contactUsWrapper {
            width: 865px;
          }
          form,
          .contactUsForm {
            width: 705px;
          }
          textarea {
            width: 650px;
          }
        }
      `}
    </style>
    <div className="backgroundWrapper">
      <div className="container">
        <div className="joinUsWrapper">
          <h2>Join Us!</h2>
          <div className="actionWrapper">
            <a href="#" className="becomeAPartner">
              Become a partner
            </a>
            <a href="#" className="contribute">
              Contribute
            </a>
          </div>
          <div className="soical-icons">
            <a href="#">
              <img src="/static/img/homepage/slack-icon.svg" alt="Slack" />
            </a>
            <a href="#">
              <img src="/static/img/homepage/twitter-icon.svg" alt="Twitter" />
            </a>
            <a href="#">
              <img
                src="/static/img/homepage/github-joinus-icon.svg"
                alt="GitHub"
              />
            </a>
          </div>
        </div>
        <div className="contactUsWrapper">
          <div className="contactUsForm">
            <h3>Contact us</h3>
            <form>
              <input type="email" name="email" placeholder="Enter your email" />
              <textarea
                className="textarea"
                placeholder="Write us a message"
              ></textarea>
              <button type="submit" className="sendButton">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

export default JoinUs;
