import React from 'react';
import PropTypes from 'prop-types';

import { Link } from '../routes';

export default class Header extends React.Component {

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    brand: PropTypes.bool,
  };

  static defaultProps = {
    brand: true,
  };

  render () {
    const { pathname, loggedInUser, brand } = this.props;
    return (
      <div>
        <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 80px;
        }
        header div {
        }
        header .brand {
          width: 200px;
          height: 45px;
        }
        .login {
          text-align: right;
          margin-left: auto;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }

        a.btn {
          color: #8800ff;
          border: 1px solid #D5DAE0;
          border-radius: 6px;
          padding: 10px 20px;
          font-size:12px;
        }

        `}
        </style>
        <header>
          {brand && (
            <div className="brand">
              <Link route="index">
                <a>
                  <img src="/static/img/logo-compact.png" alt="Back Your Stack" />
                </a>
              </Link>
            </div>
          )}
          {loggedInUser && (
            <div className="login">
              Authenticated as&nbsp;
              <strong>
                <Link route="profile" params={{ id: loggedInUser.username }}>
                  <a>{loggedInUser.username}</a>
                </Link>
              </strong>
              &nbsp;/&nbsp;
              <Link route="logout" params={{ next: pathname || '/' }}>
                <a>Sign Out</a>
              </Link>
            </div>
          )}
          {!loggedInUser && (
            <div className="login">
              <Link route="login" params={{ next: pathname || '/' }}>
                <a className="btn">Sign In with GitHub</a>
              </Link>
            </div>
          )}
        </header>
      </div>
    );
  }

}
