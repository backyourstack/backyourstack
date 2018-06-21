import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getFilesData } from '../lib/data';

import Header from '../components/Header';
import Content from '../components/Content';
import Upload from '../components/Upload';
import Footer from '../components/Footer';

import DependencyTable from '../components/DependencyTable';
import RepositoryTable from '../components/RepositoryTable';
import RecommendationList from '../components/RecommendationList';

export default class Files extends React.Component {

  static async getInitialProps ({ req }) {

    // The files is only required server side (it's ok if it's undefined on client side)
    const files = get(req, 'session.files');

    const data = await getFilesData(files);

    return { ... data };
  }

  static propTypes = {
    pathname: PropTypes.string,
    loggedInUser: PropTypes.object,
    files: PropTypes.array,
    repos: PropTypes.array,
    dependencies: PropTypes.array,
    recommendations: PropTypes.array,
  };

  constructor (props) {
    super(props);

    this.state = {
      files: props.files,
      repos: props.repos,
      dependencies: props.dependencies,
      recommendations: props.recommendations,
    };
  }

  onUpload = async () => {
    const data = await getFilesData();

    this.setState(data);
  };

  render () {
    const { pathname, loggedInUser } = this.props;
    const { files, repos, dependencies, recommendations } = this.state;
    return (
      <div>
        <Header loggedInUser={loggedInUser} pathname={pathname} />
        <Content>

          <Upload files={files} onUpload={this.onUpload} />

          {files.length === 0 &&
            <p>Upload files to get recommendations (only package.json).</p>
          }

          {files.length > 0 &&
            <Fragment>
              <h2>Recommendations</h2>
              <RecommendationList recommendations={recommendations} />

              <h2>Dependencies</h2>
              <DependencyTable dependencies={dependencies} />

              <h2>Files</h2>
              <RepositoryTable repositories={repos} />
            </Fragment>
          }

        </Content>
        <Footer />
      </div>
    );
  }

}
