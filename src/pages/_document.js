import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

import '../css/document.css';

export default class MyDocument extends Document {

  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render () {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="/_next/static/style.css" />
          <style>{`
          html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: black;
            font-family: lato, montserratlight, Helvetica, sans-serif;
            font-size: 14px;
          }
          h1 {
            font-size: 2em;
          }
          h2 {
            font-size: 1.6em;
          }
          #__next {
            background: #f1f1f1;
            margin: 0 auto;
            width: 1024px;
            min-height: 100%;
          }
          `}
          </style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
