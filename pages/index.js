import React from 'react';
import PropTypes from 'prop-types';

import { Link } from '../routes';

import Header from '../components/Header';
import Content from '../components/Content';
import Footer from '../components/Footer';

export default class Index extends React.Component {

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
  }

  render () {
    const { pathname, loggedInUser } = this.props;
    return (
      <div>
        <Header pathname={pathname} loggedInUser={loggedInUser} />
        <Content>
          <h2>Sample Organizations</h2>
          <ul>
            <li><Link route="profile" params={{ id: 'facebook' }}><a>Facebook</a></Link></li>
            <li><Link route="profile" params={{ id: 'airbnb' }}><a>Airbnb</a></Link></li>
            <li><Link route="profile" params={{ id: 'square' }}><a>Square</a></Link></li>
          </ul>
        </Content>
        <Footer />
      </div>
    );
  }

}
