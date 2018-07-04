import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class Error extends React.Component {

  static propTypes = {
    reqUrl: PropTypes.string,
    error: PropTypes.object.isRequired,
  };

  render () {
    return (
      <div>
        <p>{this.props.error.message}</p>
        <Link href={{ pathname: '/login', query: { next: reqUrl } }}>
          <a>Please Sign In with GitHub to avoid rate limit errors.</a>
        </Link>
      </div>
    );
  }

}
