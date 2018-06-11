import App, { Container } from 'next/app'
import React from 'react'
import { get } from 'lodash';

export default class MyApp extends App {

  static async getInitialProps ({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    pageProps.reqUrl = ctx.req.url;
    pageProps.loggedInUser = get(ctx.req, 'session.passport.user');

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }

}
