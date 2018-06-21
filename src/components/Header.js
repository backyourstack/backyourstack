import React from 'react';
import PropTypes from 'prop-types';

import { Link } from '../routes';

export default class Header extends React.Component {

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
  };

  render () {
    const { pathname, loggedInUser } = this.props;
    return (
      <div>
        <style jsx>{`
        header {
          display: flex;
          justify-content: space-between;
        }
        header div {
          padding: 0.5em 1em;
        }
        .login {
          text-align: right;
          margin-left: auto;
        }
        header a {
          color: inherit;
          text-decoration: none;
          font-weight: bold;
        }
        header a:hover {
          text-decoration: underline;
        }
        `}
        </style>
        <header>
          <div className="brand">
            <Link route="index"><a>Back Your Stack</a></Link> v0.0.6
          </div>
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
                <a>Sign In with GitHub</a>
              </Link>
            </div>
          )}
        </header>
      </div>
    );
  }

}
