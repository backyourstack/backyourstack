import React, { Fragment } from 'react';

const BackMyStack = ({ onClickBackMyStack }) => {
  return (
    <Fragment>
      <style jsx>
        {`
          .backMyStackWrapper {
            margin: 10px;
          }
        `}
      </style>
      <div className="backMyStackWrapper">
        <button className="bigButton" onClick={onClickBackMyStack}>
          Back My Stack
        </button>
      </div>
    </Fragment>
  );
};

export default BackMyStack;
