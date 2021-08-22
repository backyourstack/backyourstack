import React, { Fragment } from 'react';

const Header = () => {
  return (
    <Fragment>
      <style jsx>
        {`
          .header {
            background-image: url('/static/img/homepage/logo-xs-bg.svg');
            background-repeat: no-repeat;
            height: 100px;
          }
          .logoWrapper {
            margin-right: 10px;
          }
          .logo {
            height: 80px;
            width: 300px;
          }
          @media screen and (min-width: 375px) {
            .logoWrapper {
              text-align: center;
            }
          }
          @media screen and (min-width: 768px) {
            .header {
              background-image: url('/static/img/homepage/logo-md-bg.svg');
              background-repeat: no-repeat;
            }
            .logoWrapper {
              text-align: left;
              margin-left: 45px;
            }
          }
        `}
      </style>
      <div className="header">
        <div className="logoWrapper">
          <img
            src="/static/img/homepage/logo-xs.png"
            alt="Backyourstack"
            className="logo"
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
