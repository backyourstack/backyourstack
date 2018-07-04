// import webpack from 'webpack';
import withCSS from '@zeit/next-css';

module.exports = withCSS({
  webpack: (config) => {
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
