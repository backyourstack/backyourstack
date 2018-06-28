import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import fetch from 'cross-fetch';

import { dependenciesStats } from '../lib/utils';

export default class Upload extends React.Component {

  static propTypes = {
    files: PropTypes.object,
    onUpload: PropTypes.func,
    onUpdate: PropTypes.func,
  };

  static defaultProps = {
    files: {},
  };

  onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files', file);
      });
      fetch('/files/upload', { method: 'POST', body: formData })
        .then(() => {
          if (this.props.onUpload) {
            this.props.onUpload();
          }
        });
    }
  };

  handleRemoveFile = (id, event) => {
    event.stopPropagation();
    const params = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    };
    fetch('/files/delete', params)
      .then(() => {
        if (this.props.onUpdate) {
          this.props.onUpdate();
        }
      });
  };

  render () {
    const fileEntries = Object.entries(this.props.files);

    return (
      <Fragment>
        <style jsx global>{`
        .dropZoneArea {
          border-width: 1px;
          border-color: #9399A3;
          border-style: dashed;
          border-radius: 4px;
          min-height: 125px;
          position: relative;
          color: #9399A3;
          font-size: 12px;
        }
        .dropZoneArea .empty {
          position: absolute;
          width: 100%;
          top: 40%;
          text-align: center;
        }
        .Files {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .File {
          width: 180px;
          border-radius: 15px;
          background-color: #ffffff;
          box-shadow: 0 1px 3px 0 rgba(45, 77, 97, 0.2);
          margin: 10px;
          padding: 15px;
          text-align: center;
        }
        .File .name {
          height: 50px;
        }
        `}
        </style>
        <Dropzone onDrop={this.onDrop} className="dropZoneComponent">
          <div className="dropZoneArea">
            {fileEntries.length === 0 &&
              <p className="empty">
                Simply drag&#39;n&#39;drop files or click to select files to upload.
              </p>
            }
            {fileEntries.length > 0 &&
              <div className="Files">
                {fileEntries.map(([ id, file ]) => (
                  <div key={id} className="File">
                    <div className="name">
                      <b>{file.parsed.name || 'Unnamed project'}</b>
                    </div>
                    <div className="dependencies">
                      <b>{dependenciesStats(file.parsed).length}</b> dependencies
                    </div>
                    <div className="removefile">
                      <button onClick={(event) => this.handleRemoveFile(id, event)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </Dropzone>
      </Fragment>
    );
  }

}
