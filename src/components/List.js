import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

export default class List extends React.Component {

  static propTypes = {
    array: PropTypes.array.isRequired,
    map: PropTypes.func.isRequired,
    cut: PropTypes.number,
    others: PropTypes.bool,
  };

  static defaultProps = {
    cut: 10,
    others: true,
  };

  render () {
    const { array, cut, others, map } = this.props;

    return (
      <Fragment>
        {array
          .slice(0, cut)
          .map(el => map(el))
          .reduce((prev, curr) => [ prev, ', ', curr ])
        }
        {' '}
        {others && array.length > cut &&
          <span className="andOthers">
            and {array.length - cut} {array.length - cut === 1 ? 'other' : 'others'}
          </span>
        }
      </Fragment>
    );
  }

}
