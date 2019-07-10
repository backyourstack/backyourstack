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
import BackMyStack from '../components/BackMyStack';
import Modal from '../components/Modal';

const getFilesData = sessionFiles =>
  process.env.IS_CLIENT
    ? fetchJson('/data/getFilesData')
    : import('../lib/data').then(m => m.getFilesData(sessionFiles));

export default class Files extends React.Component {
  static async getInitialProps({ req, query }) {
    const initialProps = { section: query.section };

    // sessionFiles is optional and can be null (always on the client)
    const sessionFiles = get(req, 'session.files');
    const openCollectiveRedirectUrl = process.env.OPENCOLLECTIVE_REDIRECT_URL;

    const { files, dependencies, recommendations } = await getFilesData(
      sessionFiles,
    );

    return {
      ...initialProps,
      files,
      dependencies,
      recommendations,
      openCollectiveRedirectUrl,
    };
  }

  static propTypes = {
    section: PropTypes.oneOf(['dependencies']),
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    files: PropTypes.object,
    dependencies: PropTypes.array,
    recommendations: PropTypes.array,
    openCollectiveRedirectUrl: PropTypes.string,
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
      savedFileUrl: null,
      canBackMyStack: false,
      showModal: false,
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
          savedFileUrl: { ...result },
          canBackMyStack: true,
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

  handleBackMyStack = () => {
    this.setState({
      showModal: true,
    });
  };

  handleContinueBacMyStack = () => {
    // Get the key url of the file
    const { savedFileUrl } = this.state;
    const { openCollectiveRedirectUrl } = this.props;
    const { hostname, protocol } = window.location;
    const fileKey = savedFileUrl.Key.replace('.json', '');
    const jsonUrl = `"${protocol}//${hostname}/${fileKey}/file/backing.json"`;
    const contributionUrl = `${openCollectiveRedirectUrl}?data={"jsonUrl":${jsonUrl}}`;
    window.location.replace(contributionUrl);
  };

  render() {
    const { section, pathname, loggedInUser } = this.props;
    const { files, dependencies, recommendations, canBackMyStack } = this.state;
    const count = Object.keys(files).length;
    return (
      <Fragment>
        <div className="Page FilesPage">
          <style jsx global>
            {`
              .FilesPage {
                position: relative;
              }
              hr.dividerLine {
                border-top: 1px solid #d7dbe0;
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

          <nav className="navigation">
            <div className="analyzedFileInfo">
              <h1>
                {count === 0 && 'No uploaded file'}
                {count === 1 && '1 file analyzed'}
                {count > 1 && `${count} files analyzed`}
              </h1>
            </div>
            <div className="navigation-items">
              <div>
                <Link route="files">
                  <a className={classNames({ active: !section })}>
                    Projects requiring funding
                  </a>
                </Link>
                <Link route="files" params={{ section: 'dependencies' }}>
                  <a
                    className={classNames({
                      active: section === 'dependencies',
                    })}
                  >
                    Detected Dependencies
                  </a>
                </Link>
              </div>
              {canBackMyStack && (
                <BackMyStack onClickBackMyStack={this.handleBackMyStack} />
              )}
            </div>
          </nav>

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
              savedFileUrl={this.state.savedFileUrl}
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
        <Modal
          show={this.state.showModal}
          onClose={() => {
            this.setState({ showModal: false });
          }}
          title="Back My Stack"
        >
          <div>
            <style jsx>
              {`
                .modalActionBtnWrapper {
                  display: flex;
                }
                .modalActionBtnWrapper > button {
                  margin: 10px;
                  cursor: pointer;
                  font-size: 1.4rem;
                  padding: 8px 16px;
                  outline: none;
                  border: 1px solid #dcdee0;
                  border-radius: 100px;
                }
                .cancelBtn {
                  background: #fff;
                  color: #71757a;
                }
                .continueBtn {
                  background: #3f00a5;
                  color: #fff;
                }
              `}
            </style>
            <p>
              You&apos;re about to back your entier stack, donations will be
              shared every month amongst your stack collectives registerd on
              Open Collective.
            </p>
            <hr className="dividerLine" />
            <div className="modalActionBtnWrapper">
              <button
                className="cancelBtn"
                onClick={() => {
                  this.setState({ showModal: false });
                }}
              >
                Cancel
              </button>
              <button
                className="continueBtn"
                onClick={this.handleContinueBacMyStack}
              >
                Continue
              </button>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}
