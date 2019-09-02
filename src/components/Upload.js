import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import fetch from 'cross-fetch';
import classNames from 'classnames';

import supportedFiles from '../lib/dependencies/supported-files';

export default class Upload extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    onUpload: PropTypes.func,
    feedbackPosition: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    feedbackPosition: 'float',
  };

  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length === 0 && rejectedFiles.length > 0) {
      this.setErrorState();
    }
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files', file);
      });
      fetch('/files/upload', { method: 'POST', body: formData }).then(
        response => {
          if (response.status !== 200) {
            this.setErrorState();
          } else if (this.props.onUpload) {
            this.props.onUpload();
            this.setState({ error: false });
          }
        },
      );
    }
  };

  setErrorState = () => {
    this.setState({ error: true });
    setTimeout(() => {
      this.setState({ error: false });
    }, 5000);
  };

  render() {
    const supportedFilesAsComponent = supportedFiles
      .map(file => <em key={file}>{file}</em>)
      .reduce((acc, curr, idx, src) => {
        if (idx === 1) {
          return [curr];
        } else if (src.length - 1 === idx) {
          return [...acc, ' and ', curr];
        } else {
          return [...acc, ', ', curr];
        }
      });

    return (
      <Fragment>
        <style jsx global>
          {`
            .dropZoneComponent {
              border-width: 1px;
              border-color: #9399a3;
              border-style: dashed;
              border-radius: 4px;
              color: #9399a3;
              font-size: 12px;
              cursor: pointer;
              transition-duration: 1s;
            }
            .dropZoneComponent .text {
              text-align: center;
            }
            .dropZoneComponent.active {
              color: #7448ff;
              border-color: #7448ff;
            }
            .dropZoneComponent.error {
              border-color: #f53152;
              background-color: #fff2f4;
            }
            .dropZoneComponent:hover {
              color: #7448ff;
              border-color: #7448ff;
            }
            .dropZoneComponent:active,
            .dropZoneComponent:focus {
              color: #2e2e99;
              border-color: #2e2e99;
            }
          `}
        </style>

        <style jsx>
          {`
            .uploadFeedback {
              font-size: 12px;
              transition-duration: 1s;
              opacity: 0;
              display: none;
              color: #f53152;
            }
            .uploadFeedback.inside {
              text-align: center;
              background-color: #fff2f4;
              position: relative;
              padding: 20px;
            }
            .uploadFeedback.error {
              opacity: 1;
              display: block;
            }
          `}
        </style>

        <div className="uploadWrapper">
          <Dropzone
            onDrop={this.onDrop}
            className={classNames('dropZoneComponent', {
              error: this.state.error,
            })}
            activeClassName="active"
            maxSize={102400}
            style={this.props.style}
          >
            <div className="text">
              <p>
                Simply drag and drop files
                <br />
                or click to select files to upload.
              </p>
            </div>
          </Dropzone>
          <div
            className={classNames('uploadFeedback', {
              error: this.state.error,
              float: this.props.feedbackPosition === 'float',
              inside: this.props.feedbackPosition === 'inside',
            })}
          >
            <p>
              There was an error while uploading your files. At the moment, we
              do support {supportedFilesAsComponent}. Please try again. If the
              problem persists, please contact us.
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}
