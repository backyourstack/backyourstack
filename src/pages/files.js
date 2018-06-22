import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { getFilesData } from '../lib/data';

import Header from '../components/Header';
import Content from '../components/Content';
import Upload from '../components/Upload';
import Footer from '../components/Footer';

import DependencyTable from '../components/DependencyTable';
import RecommendationList from '../components/RecommendationList';

export default class Files extends React.Component {

  static async getInitialProps ({ req }) {

    // sessionFiles is optional and can be null (always on the client)
    const sessionFiles = get(req, 'session.files');

    const { files, dependencies, recommendations } = await getFilesData(sessionFiles);

    return { files, dependencies, recommendations };
  }

  static propTypes = {
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

  constructor (props) {
    super(props);

    this.state = {
      files: props.files,
      dependencies: props.dependencies,
      recommendations: props.recommendations,
    };
  }

  refresh = async () => {
    const { files, dependencies, recommendations } = await getFilesData();

    this.setState({ files, dependencies, recommendations });
  };

  render () {
    const { pathname, loggedInUser } = this.props;
    const { files, dependencies, recommendations } = this.state;
    return (
      <div>
        <Header loggedInUser={loggedInUser} pathname={pathname} />
        <Content>

          <h2>Upload Dependency Files</h2>
          <Upload files={files} onUpload={this.refresh} onUpdate={this.refresh} />

          {Object.keys(files).length > 0 &&
            <Fragment>
              <h2>Recommendations</h2>
              <RecommendationList recommendations={recommendations} />

              <h2>Dependencies</h2>
              <DependencyTable dependencies={dependencies} />
            </Fragment>
          }

        </Content>
        <Footer />
      </div>
    );
  }

}
