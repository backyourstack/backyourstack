import App, { Container } from 'next/app';
import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { get } from 'lodash';

import '../static/css/main.css';
import '../static/css/nprogress.css';

Router.onRouteChangeStart = () => NProgress.start();

Router.onRouteChangeComplete = () => NProgress.done();

Router.onRouteChangeError = () => NProgress.done();

export default class MyApp extends App {
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
        <Component {...pageProps} />
      </Container>
    );
  }
}
