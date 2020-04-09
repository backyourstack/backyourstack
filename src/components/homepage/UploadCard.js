import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Router } from '../../routes';
import Upload from '../../components/Upload';
import UploadIcon from '../../static/img/homepage/upload-icon.svg';

const onUpload = () => {
  Router.pushRoute('files');
};

const UploadCard = ({ supportedFilesAsComponent }) => (
  <Fragment>
    <style jsx>
      {`
        p {
          font-family: 'Inter UI', sans-serif;
        }
        .box {
          width: 266px;
          display: flex;
          flex-direction: column;
          min-height: 321px;
          background: #fff;
          box-shadow: 0px 4px 8px rgba(20, 20, 20, 0.16);
          border-radius: 8px;
          padding: 26px 17px;
          box-sizing: border-box;
        }
        .boxHeader {
          display: flex;
          align-items: center;
          color: #3c5869;
          font-size: 16px;
          line-height: 24px;
        }
        .boxHeader h3 {
          font-weight: 400;
        }
        .icon {
          margin-right: 20px;
          width: 20px;
          height: 20px;
        }
        .boxDescription {
          font-size: 12px;
          line-height: 16px;
          letter-spacing: -0.016em;
          color: rgba(39, 39, 48, 0.5);
        }
        @media screen and (min-width: 375px) {
          .box {
            width: 322px;
          }
        }
        @media screen and (min-width: 768px) {
          .box {
            height: 321px;
            width: 352px;
          }
        }
        @media screen and (min-width: 1194px) {
          .box {
            height: 368px;
            width: 528px;
            padding: 20px 40px;
            justify-content: space-between;
          }
          .uploadContainer {
            width: 280px;
            align-self: center;
            box-sizing: border-box;
            box-shadow: 0px 4px 8px rgba(20, 20, 20, 0.16);
          }
          .boxDescription {
            font-size: 14px;
            line-height: 24px;
            letter-spacing: -0.012em;
          }
        }
      `}
    </style>
    <div className="box">
      <div className="boxHeader">
        <div className="icon">
          <UploadIcon />
        </div>
        <h3>Upload dependency files</h3>
      </div>
      <p className="boxDescription">
        If you want to analyze private or local repositories simply upload
        dependency files. At the moment, we support {supportedFilesAsComponent}.
      </p>
      <div className="uploadContainer">
        <Upload
          onUpload={onUpload}
          feedbackPosition="float"
          style={{ height: '75px' }}
        />
      </div>
      <p className="boxDescription">
        The uploaded files will not be shared with anyone and will be deleted
        when your session expire.
      </p>
    </div>
  </Fragment>
);

UploadCard.propTypes = {
  supportedFilesAsComponent: PropTypes.any,
};

export default UploadCard;
