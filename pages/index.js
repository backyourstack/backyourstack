import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Header from '../components/Header';
import Content from '../components/Content';

export default class Index extends React.Component {

  static propTypes = {
    loggedInUser: PropTypes.object,
  }

  render () {
    return (
      <div>
        <Header loggedInUser={this.props.loggedInUser} />
        <Content>
          <h2>Sample Organizations</h2>
          <ul>
            <li><Link href="/facebook"><a>Facebook</a></Link></li>
            <li><Link href="/airbnb"><a>Airbnb</a></Link></li>
            <li><Link href="/square"><a>Square</a></Link></li>
          </ul>
        </Content>
      </div>
    )
  }

}
