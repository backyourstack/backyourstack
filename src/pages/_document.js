import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render () {
    return (
      <html>
        <Head>
          <title>Back Your Stack: Discover the Open Source projects you are using and need financial support.</title>
          <link rel="stylesheet" href="/static/fonts/inter-ui/inter-ui.css" />
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
