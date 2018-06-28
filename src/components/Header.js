import React, { Fragment } from 'react';
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
      <Fragment>

        <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .brand {
          width: 200px;
          height: 45px;
          margin-left: 60px;
        }

        .login, .loggedInUser {
          margin-left: auto;
          margin-right: 60px;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }

        .btn {
          color: #8800ff;
          border: 1px solid #D5DAE0;
          border-radius: 6px;
          padding: 10px 20px;
        }

        .profile {
          display: inline-block;
          vertical-align: -2px;
          height: 36px;
          line-height: 36px;
        }

        .avatar {
          display: inline-block;
          vertical-align: middle;
          width: 36px;
          height: 36px;
          border-radius: 36px;
          margin-left: 10px;
          margin-right: 20px;
          border: 0;
        }

        `}
        </style>

        <header>
          <div className="brand" style={{ visibility: brand ? 'visible' : 'hidden' }}>
            <Link route="index">
              <a>
                <img src="/static/img/logo-compact.png" alt="Back Your Stack" />
              </a>
            </Link>
          </div>
          {loggedInUser && (
            <div className="loggedInUser">
              <span className="profile">
                Welcome&nbsp;
                <strong>
                  <Link route="profile" params={{ id: loggedInUser.username }}>
                    <a>{loggedInUser.displayName} ({loggedInUser.username})</a>
                  </Link>
                </strong>
              </span>
              <Link route="profile" params={{ id: loggedInUser.username }}>
                <a>
                  <img className="avatar" src={loggedInUser.avatarUrl} />
                </a>
              </Link>
              &nbsp;
              <Link route="logout" params={{ next: pathname || '/' }}>
                <a className="btn">Sign Out</a>
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

      </Fragment>
    );
  }

}
