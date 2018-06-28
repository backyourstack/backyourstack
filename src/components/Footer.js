import React from 'react';

import { Link } from '../routes';

export default class Footer extends React.Component {

  render () {
    return (
      <div>
        <style jsx>{`
        footer {
          text-align: center;
          color: #6E747A;
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
          <Link route="index"><a>Back Your Stack</a></Link> is
          an <a href="https://opencollective.com/">Open Collective</a> project.&nbsp;
          <a href="https://github.com/opencollective/backyourstack">Contribute</a>.
        </footer>
      </div>
    );
  }

}
