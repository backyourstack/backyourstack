import React from 'react';
import PropTypes from 'prop-types';

export default class Content extends React.Component {

  static propTypes = {
    children: PropTypes.node,
  }

  render () {
    return (
      <div>
        <style jsx>{`
        .content {
          padding: 1em;
        }
        `}
        </style>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    )
  }

}
