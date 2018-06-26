import App, { Container } from 'next/app';
import React from 'react';
import { get } from 'lodash';

import '../css/app.css';

export default class MyApp extends App {

  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.pathname = ctx.asPath;

    if (ctx.req) {
      pageProps.loggedInUser = get(ctx, 'req.session.passport.user');
    } else if (typeof window !== 'undefined') {
      pageProps.loggedInUser = get(window, '__NEXT_DATA__.props.pageProps.loggedInUser');
    }

    return { pageProps };
  }

  render () {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }

}
