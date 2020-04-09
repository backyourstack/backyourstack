import React, { Fragment } from 'react';

const features = [
  {
    id: 'marketing',
    title: 'Marketing',
    description:
      'A transparent commitment to open source matters to your team and customers. By lifting up coders and what they do, you show what your company cares about.',
  },
  {
    id: 'operations',
    title: 'Operations',
    description:
      'Strategic commitment to open source strengthens your company culture, allowing you to retain great coders and attract new ones.. And, it helps you get work done',
  },
  {
    id: 'riskManagement',
    title: 'Risk Management',
    description:
      'Engaging with the ecosystems that are critical to product success allows you to help set roadmaps for development, reduce liability, and know about flaws before they affect your business.',
  },
];

const InvestInOpenSource = () => (
  <Fragment>
    <style jsx>
      {`
        .wrapper {
          background-color: #7a9fb8;
          background-image: url('/static/img/homepage/investinus-bg.svg');
          background-repeat: no-repeat;
          background-position: right bottom;
          padding-top: 42px;
          padding-bottom: 180px;
          margin-bottom: 30px;
        }
        .container {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .titleWrapper {
          width: 264px;
          box-sizing: border-box;
        }
        .titleWrapper h2 {
          font-weight: bold;
          font-size: 32px;
          line-height: 40px;
          text-align: center;
          color: #ffffff;
        }
        .descriptionWrapper {
          width: 271px;
          box-sizing: border-box;
        }
        .descriptionWrapper p {
          font-size: 24px;
          line-height: 32px;
          text-align: center;
          color: #ffffff;
        }
        .featureWrapper {
          margin-top: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }
        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .card {
          background: #ffffff;
          box-shadow: 0px 4px 8px rgba(20, 20, 20, 0.16);
          width: 272px;
          min-height: 320px;
          padding: 36px 15px 44px;
          box-sizing: border-box;
        }
        .card h3 {
          font-weight: bold;
          font-size: 32px;
          line-height: 40px;
          color: #3c5869;
        }
        .card p {
          font-size: 16px;
          line-height: 24px;
          color: #3c5869;
        }
        .actionWrapper {
          display: none;
        }

        @media screen and (min-width: 375px) {
          .titleWrapper {
            width: 100%;
          }
          .descriptionWrapper {
            width: 332px;
          }
          .card {
            width: 342px;
          }
          .iconWrapper {
            margin-bottom: 40px;
            margin-top: 40px;
          }
        }
        @media screen and (min-width: 768px) {
          .wrapper {
            padding-bottom: 220px;
          }
          .titleWrapper {
            width: 452px;
          }
          .descriptionWrapper {
            width: 700px;
          }
          .featureWrapper {
            flex-direction: row;
            justify-content: space-around;
            width: 100%;
          }
          .card {
            width: 230px;
            height: 384px;
            padding: 10px;
          }
          .actionWrapper {
            display: block;
            margin-top: 45px;
          }
          .becomeAPartner {
            margin-right: 30px;
          }
        }
        @media screen and (min-width: 834px) {
          .descriptionWrapper {
            width: 761px;
          }
        }
        @media screen and (min-width: 1194px) {
          .titleWrapper {
            width: 736px;
          }
          .titleWrapper h2 {
            font-size: 56px;
            line-height: 64px;
          }
          .descriptionWrapper {
            width: 822px;
          }
          .iconWrapper {
            margin-bottom: 80px;
          }
          .card {
            width: 342px;
            height: 320px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding-left: 10px;
            padding-right: 10px;
          }
        }
        @media screen and (min-width: 1440px) {
          .descriptionWrapper {
            width: 928px;
          }
          .card {
            width: 416px;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 40px;
          }
          @media screen and (min-width: 2560px) {
            .featureWrapper {
              justify-content: center;
            }
            .feature {
              margin-left: 40px;
              margin-right: 40px;
            }
          }
        }
      `}
    </style>
    <div className="wrapper">
      <div className="container">
        <div className="titleWrapper">
          <h2>Invest in open source. It&apos;s good business</h2>
        </div>
        <div className="descriptionWrapper">
          <p>
            Your stack is only as strong as the communities building the
            software you depend on. By giving back, you ensure a better future
            for your own code, and make the open source environment better for
            everyone.
          </p>
        </div>
        <div className="featureWrapper">
          {features.map(feature => (
            <div key={feature.id} className="feature">
              <div className="iconWrapper">
                <img
                  className="icon"
                  src={`/static/img/homepage/${feature.id}-icon.svg`}
                  alt={`${feature.name} Icon`}
                />
              </div>
              <div className="card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="actionWrapper">
          <a href="#" className="becomeAPartner">
            Become a partner
          </a>
          <a href="#" className="contribute">
            Contribute
          </a>
        </div>
      </div>
    </div>
  </Fragment>
);

export default InvestInOpenSource;
