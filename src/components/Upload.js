import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import fetch from 'cross-fetch';

import { dependenciesStats } from '../lib/utils';

export default class Upload extends React.Component {

  static propTypes = {
    files: PropTypes.array,
    onUpload: PropTypes.func,
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

  render () {
    const { files } = this.props;
    return (
      <div>
        <style jsx global>{`
        .dropZoneArea {
          border-width: 2px;
          border-color: rgb(102, 102, 102);
          border-style: dashed; border-radius: 5px;
          min-height: 125px;
          position: relative;
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
        <h2>Upload Dependency Files</h2>
        <Dropzone onDrop={this.onDrop} className="dropZoneComponent">
          <div className="dropZoneArea">
            {files.length === 0 &&
              <p className="empty">
                Try dropping some files here, or click to select files to upload.
              </p>
            }
            {files.length > 0 &&
              <div className="Files">
                {files.map((file, index) => (
                  <div key={file.parsed.name || index} className="File">
                    <div className="name">
                      <b>{file.parsed.name || 'Unnamed project'}</b>
                    </div>
                    <div className="dependencies">
                      <b>{dependenciesStats(file.parsed).length}</b> dependencies
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </Dropzone>
      </div>
    );
  }

}
