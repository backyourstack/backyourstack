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
            cursor: pointer;
          }
        `}
      </style>
      <div className="backMyStackWrapper">
        <div className="backMyStackInfoWrapper">
          <h2>NEW: Automatically Back Your Stack every month</h2>
          <p>
            Set up a monthly subscription and we will automatically distribute
            the funds among your dependencies on Open Collective!
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
