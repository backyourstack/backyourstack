module.exports = {
  webpack: (config, { isServer, webpack }) => {
    // For Winston
    // https://github.com/winstonjs/winston/issues/287
    config.node = { fs: 'empty' };

    config.plugins.push(
      // Define constants helping optimize the build
      new webpack.DefinePlugin({
        'process.env.IS_SERVER': JSON.stringify(isServer),
        'process.env.IS_CLIENT': JSON.stringify(!isServer),
      }),
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // Make some environment variables accessible from the client
      new webpack.EnvironmentPlugin({
        OPENCOLLECTIVE_REFERRAL: null,
        OPENCOLLECTIVE_REDIRECT_PATH: null,
        OPENCOLLECTIVE_BASE_URL: null,
        SHOW_BACK_MY_STACK: null,
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
      {
        test: /\.(woff|woff2|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: '/_next/static/fonts/',
              outputPath: 'static/fonts/',
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      },
    );

    return config;
  },
};
