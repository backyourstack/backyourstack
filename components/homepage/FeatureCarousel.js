import React, { Component, Fragment } from 'react';

const features = [
  {
    title: 'Report',
    description:
      'Output a report with a hierarchy of the open source projects in your development stack.',
  },
  {
    title: 'Analyze',
    description:
      'Scan your project for JavaScript, PHP, .NE, Go, Ruby and Python dependencies.',
  },
  {
    title: 'Choose',
    description:
      'Decide which open source projects are most important to your business needs.',
  },
  {
    title: 'Contribute',
    description:
      'Sign-up for a single contribution or monthly subscription across your portfolio of open source.',
  },
  {
    title: 'Connect',
    description:
      'Directly connect with the communities behind your open source projects. See the difference your investment makes.',
  },
];

class FeatureCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0 };
  }

  render() {
    return (
      <Fragment>
        <style jsx>
          {`
            .featureWrapper {
              display: flex;
              align-items: center;
              box-sizing: border-box;
              height: 350px;
              background-size: 147px 180px;
              margin-right: 24px;
              margin-left: 24px;
            }
            .featureCard {
              box-shadow: 0px 4px 8px rgba(20, 20, 20, 0.16);
              padding: 5px;
              box-sizing: border-box;
              align-self: center;
            }
            .featureCard h2 {
              font-size: 32px;
              line-height: 40px;
              color: #3c5869;
              margin-bottom: 16px;
            }
            .featureCard p {
              font-size: 16px;
              line-height: 24px;
              color: #3c5869;
              margin-top: 32px;
            }
            .indicator {
              height: 16px;
              width: 16px;
              border-radius: 8px;
            }
            .slider {
              overflow: hidden;
            }
            .sliderTray {
              display: flex;
              transition: transform 500ms;
            }
            .slide {
              flex: 0 0 100%;
            }
            .indicatorGroup {
              justify-content: center;
              align-items: center;
              text-align: center;
              position: relative;
            }
            @media screen and (min-width: 768px) {
              .featureCard {
                width: 390px;
                height: 260px;
                padding: 40px 35px;
              }
              .featureWrapper {
                background-size: 196px 240px;
                justify-content: space-between;
                background-position: right -30px !important;
              }
              .indicatorGroup {
                left: -20px;
              }
            }
            @media screen and (min-width: 1194px) {
              .featureCard {
                width: 416px;
                height: 260px;
              }
              .featureWrapper {
                height: 400px;
                background-position: right top !important;
              }
            }
          `}
        </style>
        <style jsx global>
          {`
            .buttonIndicator {
              padding: 0;
              outline: none;
              border: none;
              background: #e7e7e7;
              margin-right: 5px;
              border-radius: 8px;
              margin-left: 5px;
              background: '#C77970';
            }
            .buttonIndicator:disabled {
              background: #c77970;
            }
          `}
        </style>
        <div className="slider">
          <div
            className="sliderTray"
            style={{
              transform: `translateX(-${this.state.activeIndex * 100}%)`,
            }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="slide"
                aria-hidden={index !== this.state.activeIndex}
              >
                <div
                  className="featureWrapper"
                  style={{
                    backgroundImage: `url(/static/img/homepage/${feature.title}-bg.svg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition:
                      feature.title === 'Contribute'
                        ? '200px -20px'
                        : 'right top',
                  }}
                >
                  <div className="feature">
                    <div className="featureCard">
                      <h2>{feature.title}</h2>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="indicatorGroup">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              type="button"
              className="buttonIndicator"
              aria-label={`Slide ${index + 1}`}
              disabled={index === this.state.activeIndex}
              onClick={() => this.setState({ activeIndex: index })}
            >
              <div className="indicator"></div>
            </button>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default FeatureCarousel;
