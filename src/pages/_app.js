import App from 'next/app';
import Head from 'next/head';
import React, { Fragment } from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { get } from 'lodash';

import '../public/static/fonts/inter-ui/inter-ui.css';
import '../public/static/fonts/fira-code/fira-code.css';
import '../public/static/css/main.css';
import '../public/static/css/nprogress.css';
import 'pure-react-carousel/dist/react-carousel.es.css';

Router.onRouteChangeStart = () => NProgress.start();

Router.onRouteChangeComplete = () => NProgress.done();

Router.onRouteChangeError = () => NProgress.done();

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { asPath, req, res } = ctx;

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.pathname = asPath;

    if (req) {
      pageProps.loggedInUser = get(req, 'session.passport.user');
    } else if (typeof window !== 'undefined') {
      pageProps.loggedInUser = get(
        window,
        '__NEXT_DATA__.props.pageProps.loggedInUser',
      );
    }

    // Caching anonymous users
    if (req && res) {
      if (!get(req, 'session.passport') && !get(req, 'session.files')) {
        res.setHeader('Cache-Control', 's-maxage=3600, max-age=0');
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Fragment>
        <Head>
          <title>
            BackYourStack: Discover the Open Source projects you are using and
            need financial support.
          </title>
          <link
            href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          ></link>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            property="og:image"
            content="https://backyourstack.com/static/img/logo-og-1.png"
          />
        </Head>
        <Component {...pageProps} />
      </Fragment>
    );
  }
}

export default MyApp;
