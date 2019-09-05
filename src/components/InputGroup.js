import React from 'react';
import PropTypes from 'prop-types';

const InputGroup = ({
  type,
  name,
  value,
  placeholder,
  onChange,
  prepend,
  ...props
}) => {
  switch (type) {
    case 'url':
      return (
        <React.Fragment>
          <style jsx global>
            {`
              .prependInputWrapper {
                border: 1px solid rgba(24, 26, 31, 0.1);
                border-radius: 8px;
                background-color: #fff;
                display: flex;
                align-items: baseline;
              }
              .prependInputWrapper {
                border: 1px solid rgba(24, 26, 31, 0.1);
                border-radius: 8px;
                background-color: #fff;
                display: flex;
                align-items: baseline;
              }
              .prependInputWrapper.focused {
                background: white;
              }
              .prependInputWrapper.focused,
              .prependInputWrapper:hover {
                border-color: #3a2fac;
              }
              .prependInputWrapper.focused.error {
                border-color: #f53152;
              }
              .prependInput {
                color: #c0c5cc;
                background: #f5f7fa;
                font-size: 14px;
                line-height: 22px;
                text-align: center;
                border: none;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                padding: 10px;
              }
              .input {
                font-size: 16px;
                padding: 10px;
                border: 0;
                border-style: solid;
                background: transparent;
                width: calc(100% - 160px);
              }
              .input::placeholder {
                color: #c0c5cc;
                font-size: 14px;
                line-height: 24px;
              }
              .input:focus {
                outline: none;
                color: #2e3033;
              }
              @media screen and (max-width: 500px) {
                .input {
                  padding: 5px;
                }
              }
            `}
          </style>
          <div className="prependInputWrapper">
            <div className="prependInput">{prepend}</div>
            <input
              type="text"
              name={name}
              onChange={onChange}
              onFocus={props.onFocus}
              onBlur={props.onBlur}
              value={value}
              placeholder={placeholder}
              autoCapitalize="none"
              autoComplete="off"
              className="input"
            />
          </div>
        </React.Fragment>
      );
    default:
      return (
        <div>
          <input
            className="input"
            type="text"
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
          />
        </div>
      );
  }
};

InputGroup.propTypes = {
  type: PropTypes.string,
  prepend: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  ref: PropTypes.any,
};

export default InputGroup;
