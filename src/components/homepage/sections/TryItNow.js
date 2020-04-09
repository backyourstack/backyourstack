import React, { Fragment } from 'react';
import GitHubSearchCard from '../GitHubSearchCard';
import UploadCard from '../UploadCard';
import supportedFiles from '../../../lib/dependencies/supported-files';

const supportedFilesAsComponent = supportedFiles
  .map(file => <span key={file}>{file}</span>)
  .reduce((acc, curr, idx, src) => {
    if (idx === 0) {
      return [curr];
    } else if (src.length - 1 === idx) {
      return [...acc, ' and ', curr];
    } else {
      return [...acc, ', ', curr];
    }
  }, []);

const TryItNow = () => (
  <Fragment>
    <style jsx>
      {`
        .container {
          margin-left: 25px;
          margin-right: 25px;
          margin-bottom: 30px;
        }
        .title {
          font-weight: bold;
          font-size: 32px;
          line-height: 40px;
          text-align: center;
          color: #3c5869;
        }
        .cardsWrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .cardWrapper {
          margin-top: 15px;
          margin-bottom: 15px;
        }
        @media screen and (min-width: 768px) {
          .cardsWrapper {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        @media screen and (min-width: 1194px) {
          .cardsWrapper {
            justify-content: center;
          }
          .githubCard {
            margin-right: 40px;
          }
          .uploadCard {
            margin-left: 45px;
          }
        }
        @media screen and (min-width: 1440px) {
          .container {
            margin-top: 50px;
          }
          .title {
            margin-bottom: 40px;
          }
          .githubCard {
            margin-right: 75px;
          }
          .uploadCard {
            margin-left: 75px;
          }
        }
      `}
    </style>
    <div className="container">
      <h2 className="title">Try it now!</h2>
      <div className="cardsWrapper">
        <div className="cardWrapper githubCard">
          <GitHubSearchCard />
        </div>
        <div className="cardWrapper uploadCard">
          <UploadCard supportedFilesAsComponent={supportedFilesAsComponent} />
        </div>
      </div>
    </div>
  </Fragment>
);

export default TryItNow;
