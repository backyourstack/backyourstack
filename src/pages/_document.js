import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>
            BackYourStack: Discover the Open Source projects you are using and
            need financial support.
          </title>
          <link rel="stylesheet" href="/static/fonts/inter-ui/inter-ui.css" />
          <link rel="stylesheet" href="/_next/static/style.css" />
          <meta
            property="og:image"
            content="https://backyourstack.com/static/img/logo-og-1.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
