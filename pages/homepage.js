import React, { Component } from 'react';
import { get } from 'lodash';
import Header from '../components/homepage/sections/Header';
import SustainWhatSustainYou from '../components/homepage/sections/SustainWhatSustainYou';
import WhatIsBackyourstack from '../components/homepage/sections/WhatIsBackyourstack';
import TryItNow from '../components/homepage/sections/TryItNow';
import InvestInOpenSource from '../components/homepage/sections/InvestInOpenSource';
import OurValues from '../components/homepage/sections/OurValues';
import JoinUs from '../components/homepage/sections/JoinUs';
import Footer from '../components/homepage/sections/Footer';

export default class Homepage extends Component {
  static getInitialProps({ req }) {
    const initialProps = {};

    let accessToken;
    if (req) {
      accessToken = get(req, 'session.passport.user.accessToken');
    } else if (typeof window !== 'undefined') {
      accessToken = get(
        window,
        '__NEXT_DATA__.props.pageProps.loggedInUser.accessToken',
      );
    }
    if (accessToken) {
      // initialProps.loggedInUserOrgs = await getUserOrgs(accessToken);
    }

    return initialProps;
  }

  render() {
    return (
      <div className="HomePage">
        <style jsx>
          {`
            .joinUsFooter {
              background-color: #7a9fb8;
            }
            @media screen and (min-width: 2560px) {
              .HomePage {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
              }
              .investinus,
              .joinUsFooter {
                width: 100%;
              }
              .ourValues {
                width: 1440px;
              }
            }
          `}
        </style>
        <div className="header">
          <Header />
        </div>
        <SustainWhatSustainYou />
        <WhatIsBackyourstack />
        <TryItNow />
        <div className="investinus">
          <InvestInOpenSource />
        </div>
        <div className="ourValues">
          <OurValues />
        </div>
        <div className="joinUsFooter">
          <JoinUs />
          <Footer />
        </div>
      </div>
    );
  }
}
