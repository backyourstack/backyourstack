import React, { Component, Fragment } from 'react';
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  Dot,
} from 'pure-react-carousel';

const features = [
  {
    title: 'Report',
    description:
      'Output a report with a hierarchy of the open source projects in your development stack.',
  },
  {
    title: 'Analize',
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
    this.state = {
      activeIndex: 0,
      direction: '',
      sliding: false,
    };
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
              padding-bottom: 10px;
              padding-top: 20px;
              height: 350px;
              background-size: 147px 180px;
            }
            .featureCard {
              box-shadow: 0px 4px 8px rgba(20, 20, 20, 0.16);
              padding: 5px;
              box-sizing: border-box;
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
            .navigator {
              width: 24px;
              height: 24px;
            }
            .indicator {
              height: 16px;
              width: 16px;
              border-radius: 8px;
            }
            .indicatorGroup {
              justify-content: center;
              align-items: center;
              text-align: center;
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
            .navButton {
              outline: none;
              background: none;
              border: none;
              padding: 0;
            }
          `}
        </style>
        <CarouselProvider
          naturalSlideHeight={1}
          naturalSlideWidth={1}
          totalSlides={features.length}
          isIntrinsicHeight={true}
        >
          <Slider>
            {features.map((feature, index) => (
              <Slide key={feature.title} index={index}>
                <div
                  className="featureWrapper"
                  key={feature.title}
                  style={{
                    backgroundImage: `url(/static/img/homepage/${feature.title}-bg.svg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition:
                      feature.title === 'Contribute'
                        ? '200px -20px'
                        : 'right top',
                  }}
                >
                  <div className="leftNavigator">
                    <ButtonBack className="navButton">
                      <img
                        src="/static/img/homepage/left-navigator.svg"
                        alt="Left Navigator"
                        className="navigator"
                      />
                    </ButtonBack>
                  </div>
                  <div className="feature">
                    <div className="featureCard">
                      <h2>{feature.title}</h2>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                  <div className="rightNavigator">
                    <ButtonNext className="navButton">
                      <img
                        src="/static/img/homepage/right-navigator.svg"
                        alt="Left Navigator"
                        className="navigator"
                      />
                    </ButtonNext>
                  </div>
                </div>
              </Slide>
            ))}
          </Slider>
          <div className="indicatorGroup">
            {Array.from({ length: features.length }).map((_, index) => (
              <Dot
                slide={index}
                className="buttonIndicator"
                key={index.toString()}
              >
                <div className="indicator"></div>
              </Dot>
            ))}
          </div>
        </CarouselProvider>
      </Fragment>
    );
  }
}

export default FeatureCarousel;
