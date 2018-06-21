import React from 'react';

import { Link } from '../routes';

export default class Footer extends React.Component {

  render () {
    return (
      <div>
        <style jsx>{`
        footer {
          padding: 0.5em 1em;
          text-align: right;
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
          <Link route="index"><a>Back Your Stack</a></Link>: An Open Collective project.
        </footer>
      </div>
    );
  }

}
