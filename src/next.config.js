import webpack from 'webpack';
import withCSS from '@zeit/next-css';

module.exports = withCSS({
  webpack: config => {
    // For Winston
    // https://github.com/winstonjs/winston/issues/287
    config.node = { fs: 'empty' };

    config.plugins.push(
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // Make some environment variables accessible from the client
      new webpack.EnvironmentPlugin({
        OPENCOLLECTIVE_REFERRAL: null,
      }),
    );

    if (process.env.WEBPACK_BUNDLE_ANALYZER) {
      // eslint-disable-next-line node/no-unpublished-require
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: true,
          openAnalyzer: false,
        }),
      );
    }

    config.module.rules.push(
      {
        test: /\.svg$/,
        loader: 'svg-react-loader',
      },
      {
        test: /\.md$/,
        use: ['babel-loader', '@mdx-js/loader'],
      },
    );

    return config;
  },
});
