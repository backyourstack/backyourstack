import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
    reqUrl: PropTypes.string,
  }

  render () {
    const { reqUrl, loggedInUser } = this.props;
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
        `}
        </style>
        <header>
          <div className="brand">Back Your Stack v0.0.1</div>
          {loggedInUser && (
            <div className="login">
              Authenticated as <strong>{loggedInUser.username}</strong>
              &nbsp;
              <a href={`/logout?next=${reqUrl || '/'}`}>Sign Out</a>
            </div>
          )}
          {!loggedInUser && (
            <div className="login">
              <a href={`/login?next=${reqUrl || '/'}`}>Sign In</a>
            </div>
          )}
        </header>
      </div>
    )
  }

}
