import React, { Fragment } from 'react';

const SaveProfile = ({ onClickSaveProfile, savedFileUrls }) => {
  return (
    <Fragment>
      <style jsx>
        {`
          .saveProfileWrapper {
            margin: 10px;
          }
          .savedFileUrlContainer {
            padding: 20px;
          }
          .savedFileUrlContainer label {
            font-size: 15px;
            font-weight: 500;
          }
          .savedFileUrlContainer input {
            width: 100%;
            height: 10px;
            padding: 10px;
          }
          .saveProfileBtn {
            cusor: pointer;
          }
        `}
      </style>
      <div className="saveProfileWrapper">
        {savedFileUrls.length > 0 &&
          savedFileUrls.map(url => {
            return (
              <div key={url.key} className="savedFileUrlContainer">
                <label>Saved File Url</label>
                <input type="url" value={url.Location} />
              </div>
            );
          })}
        {savedFileUrls.length === 0 && (
          <button
            className="bigButton saveProfileBtn"
            onClick={onClickSaveProfile}
          >
            Save profile
          </button>
        )}
      </div>
    </Fragment>
  );
};

export default SaveProfile;
