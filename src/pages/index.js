import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getUserOrgs } from '../lib/data';

import { Link, Router } from '../routes';

import Header from '../components/Header';
import Content from '../components/Content';
import Upload from '../components/Upload';
import Footer from '../components/Footer';

export default class Index extends React.Component {

  static async getInitialProps ({ req }) {
    const initialProps = {};

    const files = get(req, 'session.files');
    initialProps.files = files ? Object.values(files) : [];

    const accessToken = get(req, 'session.passport.user.accessToken');
    if (accessToken) {
      initialProps.loggedInUserOrgs = await getUserOrgs(accessToken);
    }

    return initialProps;
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    loggedInUserOrgs: PropTypes.array,
    files: PropTypes.array,
  };

  constructor (props) {
    super(props);
    this.state = { q: '' };
  }

  handleChange = (event) => {
    this.setState({ q: event.target.value });
  };

  handleSubmit = (event) => {
    Router.pushRoute('search', { q: this.state.q });
    event.preventDefault();
  };

  onUpload = () => {
    Router.pushRoute('files');
  };

  render () {
    const { pathname, loggedInUser, loggedInUserOrgs, files } = this.props;
    return (
      <div>

        <Header pathname={pathname} loggedInUser={loggedInUser} />

        <Content>

          <h1>Back Your Stack</h1>

          <p>
            Discover the open source projects
            that you are using and that need financial support.
          </p>

          <div className="search">
            <form method="GET" action="/search" onSubmit={this.handleSubmit}>
              <span>https://github.com/</span>
              <input type="text" name="q" value={this.state.value} onChange={this.handleChange} />
              <input type="submit" value="Search" />
            </form>
            <p>
              E.g.
              <Link route="profile" params={{ id: 'facebook' }}><a>Facebook</a></Link>
              &nbsp;-&nbsp;
              <Link route="profile" params={{ id: 'airbnb' }}><a>Airbnb</a></Link>
              &nbsp;-&nbsp;
              <Link route="profile" params={{ id: 'square' }}><a>Square</a></Link>
            </p>
          </div>

          {loggedInUser && (
            <>
              <h2>Welcome {loggedInUser.username}</h2>
              {loggedInUserOrgs &&
                <>
                  <p>Your organizations:</p>
                  <ul>
                    {loggedInUserOrgs.map(org => (
                      <li key={org.id}>
                        <Link route="profile" params={{ id: org.login }}>
                          <a>{org.login}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              }
            </>
          )}

          <Upload files={files} onUpload={this.onUpload} />

        </Content>

        <Footer />

      </div>
    );
  }

}
