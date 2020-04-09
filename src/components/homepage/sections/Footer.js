import React, { Fragment } from 'react';
import { Link } from '../../../routes';

const Footer = () => (
  <Fragment>
    <style jsx>
      {`
        footer {
          background-image: url('/static/img/homepage/footer-bg.svg');
          background-repeat: no-repeat;
          background-position: left bottom;
          background-size: 30% 40%;
          height: 152px;
        }
        footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Inter UI', sans-serif;
        }
        .container {
          font-size: 14px;
          line-height: 24px;
          text-align: center;
          letter-spacing: -0.012em;
          color: #fffef9;
        }
        .container a {
          text-decoration: none;
        }
        .logoWrapper {
          display: flex;
          width: 100%;
          justify-content: center;
          box-sizing: border-box;
        }
        .logoWrapper img {
          width: 244px;
        }
        .container {
          margin-right: 5px;
        }
        .logoWrapper {
          margin-left: 5px;
        }
        @media screen and (min-width: 768px) {
          footer {
            background-size: auto;
            margin-top: 50px;
          }
        }
        @media screen and (min-width: 1194px) {
          footer {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .logoWrapper {
            width: 300px;
            display: block;
          }
          .container {
            margin-right: 90px;
          }
          .logoWrapper {
            margin-left: 65px;
          }
          .container,
          .logoWrapper {
            position: relative;
            top: 30px;
          }
        }
      `}
    </style>
    <footer>
      <div className="logoWrapper">
        <img src="/static/img/homepage/logo-footer.png" alt="Backyourstack" />
      </div>
      <div className="container">
        BackYourStack is an{' '}
        <a
          style={{ textDecoration: 'none' }}
          href="https://github.com/backyourstack/backyourstack"
        >
          Open Source project
        </a>{' '}
        started by <a href="https://opencollective.com/">Open Collective</a>
        &nbsp;|&nbsp;
        <Link route="faq">
          <a>FAQ</a>
        </Link>
        &nbsp;|&nbsp;
        <Link route="contributing">
          <a>Contribute</a>
        </Link>
      </div>
    </footer>
  </Fragment>
);

export default Footer;
