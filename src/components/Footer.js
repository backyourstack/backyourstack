import React from 'react';

export default class Footer extends React.Component {

  render () {
    return (
      <div>
        <style jsx>{`
        footer {
          padding: 0.5em 1em;
          text-align: right;
        }
        `}
        </style>
        <footer>
          <strong>Back Your Stack</strong>: An Open Collective project.
        </footer>
      </div>
    );
  }

}
