import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const EditSavedDependenciesBanner = ({ onClose, id }) => (
  <Fragment>
    <style jsx>
      {`
        .bannerWrapper {
          display: flex;
          color: #fff;
          font-size: 14px;
          background-color: #5c48e0;
          height: 80px;
          justify-content: center;
          align-items: baseline;
          padding: 5px;
        }
        .bannerContent {
          display: flex;
          flex-direction: column;
          justify-conent: center;
          align-items: center;
        }
        .viewButton {
          padding: 4px 8px;
          background: #fff;
          color: #5c48e0;
          border-radius: 3px;
          text-decoration: none;
        }
        .closeSign {
          position: relative;
          left: 20%;
        }
        .closeSign button {
          outline: none;
          border: none;
          background: none;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
        }
      `}
    </style>
    <div className="bannerWrapper">
      <div className="bannerContent">
        <p>
          You currently have a saved selected dependencies for your profile,
          Will you like to edit?
        </p>
        <a
          href={`/monthly-plan?id=${id}&type=profile&editSavedDependencies=true`}
          className="viewButton"
        >
          Edit
        </a>
      </div>
      <div className="closeSign">
        <button onClick={onClose}>X</button>
      </div>
    </div>
  </Fragment>
);

EditSavedDependenciesBanner.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default EditSavedDependenciesBanner;
