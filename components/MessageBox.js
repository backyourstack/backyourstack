import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const MessageBox = ({ type, message, onClose }) => {
  return (
    <Fragment>
      <style jsx>
        {`
          .messageBoxWrapper {
            height: 30px;
            width: 96%;
            display: flex;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 20px;
            justify-content: space-between;
            align-items: center;
          }
          .message {
            color: #fff;
          }
          .error {
            background: red;
          }
          p {
            font-size: 16px;
            margin: 0;
          }
          button {
            outline: none;
            background: none;
            color: #fff;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
        `}
      </style>
      <div
        className={classnames('messageBoxWrapper', { error: type === 'error' })}
      >
        <div className="message">
          <p>{message}</p>
        </div>
        <div className="closeSign">
          <button onClick={onClose}>X</button>
        </div>
      </div>
    </Fragment>
  );
};

MessageBox.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MessageBox;
