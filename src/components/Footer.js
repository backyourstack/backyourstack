import React from 'react';

import GithubLogo from '../static/img/gray-github.svg';
import TwitterLogo from '../static/img/gray-twitter.svg';
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
              text-decoration: underline;
            }
            .footer-icons {
              display: flex;
              align-items: center;
              justify-content: center;
              color: #9399a3;
            }
            .soical-icons {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 35px;
              height: 35px;
              margin: 25px 10px;
              border: 1px solid #9399a3;
              border-radius: 30px;
              padding: 5px;
            }
          `}
        </style>
        <footer>
          <div>
            BackYourStack is an{' '}
            <a
              style={{ textDecoration: 'none' }}
              href="https://github.com/opencollective/backyourstack"
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
          <div className="footer-icons">
            <a href="https://twitter.com/opencollect">
              <div className="soical-icons">
                <TwitterLogo />
              </div>
            </a>
            <a href="https://github.com/opencollective/backyourstack">
              <div className="soical-icons">
                <GithubLogo />
              </div>
            </a>
          </div>
        </footer>
      </div>
    );
  }
}
