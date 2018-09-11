import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

export default class Content extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <Fragment>
        <style jsx>
          {`
            .content {
              padding: 1em 0;
            }
          `}
        </style>
        <div className="content">{this.props.children}</div>
      </Fragment>
    );
  }
}
