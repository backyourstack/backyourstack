import React, { Fragment, useState } from 'react';

const Partners = () => {
  const [logoType, setLogoType] = useState({
    OSC: 'gray',
    MM: 'gray',
    CF: 'gray',
    OSI: 'gray',
    OC: 'gray',
  });

  const handleOnMouseEnter = logo => {
    setLogoType({ ...logoType, [logo]: 'color' });
  };

  const handleOnMouseLeave = logo => {
    setLogoType({ ...logoType, [logo]: 'gray' });
  };

  return (
    <Fragment>
      <style jsx>
        {`
          .partners {
            display: flex;
            margin-top: 30px;
            overflow-x: auto;
          }
          .partners a {
            margin-left: 10px;
            margin-right: 10px;
          }
          @media screen and (min-width: 768px) {
            .partners {
              flex-wrap: wrap;
              overflow-x: none;
              justify-content: center;
              margin-left: 30px;
              margin-right: 30px;
            }
            .partners a {
              margin: 10px 20px;
            }
          }
        `}
      </style>
      <div className="partners">
        <a
          href="#"
          onMouseEnter={() => handleOnMouseEnter('OSC')}
          onMouseLeave={() => handleOnMouseLeave('OSC')}
        >
          <img
            src={`/static/img/homepage/OSC-${logoType.OSC}.svg`}
            alt="Open source collective"
          />
        </a>
        <a
          href="#"
          onMouseEnter={() => handleOnMouseEnter('MM')}
          onMouseLeave={() => handleOnMouseLeave('MM')}
        >
          <img
            src={`/static/img/homepage/MM-${logoType.MM}.svg`}
            alt="Maintainer Mountaineer"
          />
        </a>
        <a
          href="#"
          onMouseEnter={() => handleOnMouseEnter('CF')}
          onMouseLeave={() => handleOnMouseLeave('CF')}
        >
          <img
            src={`/static/img/homepage/CF-${logoType.CF}.svg`}
            alt="Code Fund"
          />
        </a>
        <a
          href="#"
          onMouseEnter={() => handleOnMouseEnter('OSI')}
          onMouseLeave={() => handleOnMouseLeave('OSI')}
        >
          <img
            src={`/static/img/homepage/OSI-${logoType.OSI}.svg`}
            alt="Open Source Initative"
          />
        </a>
        <a
          href="#"
          onMouseEnter={() => handleOnMouseEnter('OC')}
          onMouseLeave={() => handleOnMouseLeave('OC')}
        >
          <img
            src={`/static/img/homepage/OC-${logoType.OC}.svg`}
            alt="Open collective"
          />
        </a>
      </div>
    </Fragment>
  );
};

export default Partners;
