import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getUserOrgs, getFilesData } from '../lib/data';

import { Link, Router } from '../routes';

import Header from '../components/Header';
import Content from '../components/Content';
import Upload from '../components/Upload';
import Footer from '../components/Footer';

export default class Index extends React.Component {

  static async getInitialProps ({ req }) {
    const initialProps = {};

    let accessToken;
    if (req) {
      accessToken = get(req, 'session.passport.user.accessToken');
    } else if (typeof window !== 'undefined') {
      accessToken = get(window, '__NEXT_DATA__.props.pageProps.loggedInUser.accessToken');
    }
    if (accessToken) {
      initialProps.loggedInUserOrgs = await getUserOrgs(accessToken);
    }

    // sessionFiles is optional and can be null (always on the client)
    const sessionFiles = get(req, 'session.files');
    const { files } = await getFilesData(sessionFiles);

    return { files, ... initialProps };
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    loggedInUserOrgs: PropTypes.array,
    files: PropTypes.object,
  };

  static defaultProps = {
    files: {},
  };

  constructor (props) {
    super(props);
    this.state = { q: '', files: props.files };
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

  refresh = async () => {
    const { files } = await getFilesData();

    this.setState({ files });
  };

  render () {
    const { pathname, loggedInUser, loggedInUserOrgs } = this.props;
    const { files } = this.state;
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

          <h2>Upload Dependency Files</h2>
          {Object.keys(files).length > 0 &&
            <p>
              <Link route="files"><a>View recommendations</a></Link>
            </p>
          }
          <Upload files={files} onUpload={this.onUpload} onUpdate={this.refresh} />

        </Content>

        <Footer />

      </div>
    );
  }

}
