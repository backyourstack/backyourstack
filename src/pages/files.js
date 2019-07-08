import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';

import { Link, Router } from '../routes';

import { fetchJson } from '../lib/fetch';
import { dependenciesStats } from '../lib/dependencies/utils';

import Header from '../components/Header';
import Upload from '../components/Upload';

import DependencyTable from '../components/DependencyTable';
import RecommendationList from '../components/RecommendationList';
import SaveProfile from '../components/SaveProfile';

const getFilesData = sessionFiles =>
  process.env.IS_CLIENT
    ? fetchJson('/data/getFilesData')
    : import('../lib/data').then(m => m.getFilesData(sessionFiles));

export default class Files extends React.Component {
  static async getInitialProps({ req, query }) {
    const initialProps = { section: query.section };

    // sessionFiles is optional and can be null (always on the client)
    const sessionFiles = get(req, 'session.files');

    const { files, dependencies, recommendations } = await getFilesData(
      sessionFiles,
    );

    return { ...initialProps, files, dependencies, recommendations };
  }

  static propTypes = {
    section: PropTypes.oneOf(['dependencies']),
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    files: PropTypes.object,
    dependencies: PropTypes.array,
    recommendations: PropTypes.array,
  };

  static defaultProps = {
    files: {},
    dependencies: [],
    recommendations: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      files: props.files,
      dependencies: props.dependencies,
      recommendations: props.recommendations,
      savedFileUrls: [],
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  refresh = async () => {
    const { files, dependencies, recommendations } = await getFilesData();

    if (Object.keys(files).length === 0) {
      Router.pushRoute('index');
    } else {
      this.setState({ files, dependencies, recommendations });
    }
  };

  handleSaveProfile = event => {
    event.stopPropagation();
    const { files } = this.state;
    const ids = Object.keys(files);
    const params = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
      credentials: 'same-origin',
    };
    fetch('/files/save', params)
      .then(response => {
        return response.json();
      })
      .then(result => {
        this.setState({
          savedFileUrls: [...result, ...this.state.savedFileUrls],
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleRemoveFile = (id, event) => {
    event.stopPropagation();
    const params = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
      credentials: 'same-origin',
    };
    fetch('/files/delete', params).then(() => {
      this.refresh();
    });
  };

  render() {
    const { section, pathname, loggedInUser } = this.props;
    const { files, dependencies, recommendations } = this.state;
    const count = Object.keys(files).length;
    return (
      <div className="Page FilesPage">
        <style jsx global>
          {`
            .FilesPage {
              position: relative;
            }
          `}
        </style>

        <style jsx>
          {`
            .File {
              margin-bottom: 40px;
            }
            .File .name {
              font-size: 20px;
              line-height: 26px;
              color: #2e3033;
            }
            .File .dependencies {
              font-size: 16px;
              line-height: 24px;
              color: #6e747a;
              margin-top: 5px;
            }
            .File .actionButton {
              margin-top: 10px;
            }
          `}
        </style>

        <Header loggedInUser={loggedInUser} pathname={pathname} />

        <div className="navigation">
          <h1>
            {count === 0 && 'No uploaded file'}
            {count === 1 && '1 file analyzed'}
            {count > 1 && `${count} files analyzed`}
          </h1>

          <div className="navigation-items">
            <Link route="files">
              <a className={classNames({ active: !section })}>
                Projects requiring funding
              </a>
            </Link>
            <Link route="files" params={{ section: 'dependencies' }}>
              <a className={classNames({ active: section === 'dependencies' })}>
                Detected Dependencies
              </a>
            </Link>
          </div>
        </div>

        <aside>
          {Object.entries(files).map(([id, file]) => (
            <div key={id} className="File">
              <div className="name">
                <strong>{file.projectName || 'Unnamed project'}</strong>
              </div>
              <div className="dependencies">
                {dependenciesStats(file).length} dependencies
              </div>
              <button
                className="actionButton"
                onClick={e => this.handleRemoveFile(id, e)}
              >
                ✘ Remove file
              </button>
            </div>
          ))}
          <SaveProfile
            onClickSaveProfile={this.handleSaveProfile}
            savedFileUrls={this.state.savedFileUrls}
          />

          <Upload
            onUpload={this.refresh}
            onUpdate={this.refresh}
            feedbackPosition="inside"
          />
        </aside>

        <main>
          {count === 0 && (
            <div className="error">
              <p>
                Please upload at least one file to detect dependencies and
                projects.
              </p>
            </div>
          )}
          {count > 0 && (
            <Fragment>
              {!section && (
                <RecommendationList recommendations={recommendations} />
              )}

              {section === 'dependencies' && (
                <DependencyTable dependencies={dependencies} />
              )}
            </Fragment>
          )}
        </main>
      </div>
    );
  }
}
