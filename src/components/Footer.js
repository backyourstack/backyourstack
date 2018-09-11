import React from 'react';

import { Link } from '../routes';

export default class Footer extends React.Component {
  render() {
    return (
      <div>
        <style jsx>
          {`
            footer {
              text-align: center;
              color: #6e747a;
              font-size: 12px;
              margin-top: 50px;
              margin-bottom: 50px;
            }
            footer a {
              color: inherit;
              text-decoration: none;
              font-weight: bold;
            }
            footer a:hover {
              text-decoration: underline;
            }
          `}
        </style>
        <footer>
          <Link route="index">
            <a>BackYourStack</a>
          </Link>{' '}
          is an{' '}
          <a href="https://github.com/opencollective/backyourstack">
            Open Source project
          </a>{' '}
          initiated by <a href="https://opencollective.com/">Open Collective</a>
          .<br />
          <Link route="faq">
            <a>FAQ</a>
          </Link>
          &nbsp;-&nbsp;
          <Link route="contributing">
            <a>Contribute</a>
          </Link>
        </footer>
      </div>
    );
  }
}
