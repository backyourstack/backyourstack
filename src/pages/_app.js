import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
import NProgress from 'next-nprogress/component';
import { get } from 'lodash';

import '../static/fonts/inter-ui/inter-ui.css';
import '../static/css/main.css';

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
      <Container>
        <Head>
          <title>
            BackYourStack: Discover the Open Source projects you are using and
            need financial support.
          </title>
        </Head>
        <Component {...pageProps} />
        <NProgress color="#3b0c9c" />
      </Container>
    );
  }
}

export default MyApp;
