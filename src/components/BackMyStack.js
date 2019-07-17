import React, { Fragment } from 'react';

const BackMyStack = ({ onClickBackMyStack }) => {
  return (
    <Fragment>
      <style jsx>
        {`
          .backMyStackWrapper {
            margin-bottom: 20px;
            max-width: 90%;
            display: flex;
            align-items: center;
            border: 1px solid #c1c6cc;
            border-radius: 15px;
            padding: 20px 40px;
            justify-content: space-between;
          }
          .backMyStackInfoWrapper {
            width: 60%;
          }
          .backMyStackInfoWrapper h2 {
            color: #8f8f8f;
          }
          .backMyStackInfoWrapper p {
            font-size: 1.3rem;
          }
          .backMyStackBtn {
            height: 50px;
          }
        `}
      </style>
      <div className="backMyStackWrapper">
        <div className="backMyStackInfoWrapper">
          <h2>NEW: Automatically Back Your Stack every month</h2>
          <p>
            With our monthly plan available from Open Collective, commit a fixed
            amount every month and the money will be automatically dispatched to
            your dependencies!
          </p>
        </div>
        <button
          className="bigButton backMyStackBtn"
          onClick={onClickBackMyStack}
        >
          Back My Stack
        </button>
      </div>
    </Fragment>
  );
};

export default BackMyStack;
