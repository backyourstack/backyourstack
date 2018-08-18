import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import fetch from 'cross-fetch';
import classNames from 'classnames';

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

  constructor (props) {
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
      fetch('/files/upload', { method: 'POST', body: formData })
        .then(response => {
          if (response.status !== 200) {
            this.setErrorState();
          } else if (this.props.onUpload) {
            this.props.onUpload();
            this.setState({ error: false });
          }
        });
    }
  };

  setErrorState = () => {
    this.setState({ error: true });
    setTimeout(() => {
      this.setState({ error: false });
    }, 5000);
  };

  render () {
    return (
      <Fragment>

        <style jsx global>{`
        .dropZoneComponent {
          border-width: 1px;
          border-color: #9399A3;
          border-style: dashed;
          border-radius: 4px;
          position: relative;
          color: #9399A3;
          font-size: 12px;
          cursor: pointer;
          transition-duration: 1s;
        }
        .dropZoneComponent .text {
          position: absolute;
          width: 100%;
          top: 25%;
          text-align: center;
        }
        .dropZoneComponent.active {
          color: #7448FF;
          border-color: #7448FF;
        }
        .dropZoneComponent.error {
          border-color: #F53152;
          background-color: #FFF2F4;
        }
        .dropZoneComponent:hover {
          color: #7448FF;
          border-color: #7448FF;
        }
        .dropZoneComponent:active, .dropZoneComponent:focus {
          color: #2E2E99;
          border-color: #2E2E99;
        }
        `}
        </style>

        <style jsx>{`
        .uploadFeedback {
          font-size: 12px;
          transition-duration: 1s;
          opacity: 0;
          color: #F53152;
        }
        .uploadFeedback.float {
          position: absolute;
          width: 200px;
          right: 0;
          margin-right: -220px;
        }
        .uploadFeedback.inside {
          text-align: center;
          background-color: #FFF2F4;
          position: relative;
          background-color: lime;
          padding: 20px;
        }
        .uploadFeedback.error {
          opacity: 1;
        }
        `}
        </style>

        <Dropzone
          onDrop={this.onDrop}
          className={classNames('dropZoneComponent', { error: this.state.error })}
          activeClassName="active"
          maxSize={102400}
          style={this.props.style}
          >
          <div className="text">
            <p>
              Simply drag&#39;n&#39;drop files<br />
              or click to select files to upload.
            </p>
          </div>
          <div
            className={classNames(
              'uploadFeedback', {
                error: this.state.error,
                float: this.props.feedbackPosition === 'float',
                inside: this.props.feedbackPosition === 'inside',
              }
            )}
            >
            <p>
              There was an error while uploading your files. Only <em>package.json</em> and <em>composer.json</em> are accepted right now.
            </p>
            <p>
              Please try again. If the problem persists, please contact us.
            </p>
          </div>
        </Dropzone>

      </Fragment>
    );
  }

}
