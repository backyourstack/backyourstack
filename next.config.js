const withMDX = require('@next/mdx')({
  // FAQ.md and CONTRIBUTING.md are imported as React components
  extension: /\.mdx?$/,
  // Parse .md as MDX too, to keep their inline HTML (<del>)
  options: { format: 'mdx' },
});

// Make some environment variables accessible from the client
const clientEnvironmentVariables = [
  'OPENCOLLECTIVE_REFERRAL',
  'OPENCOLLECTIVE_REDIRECT_PATH',
  'OPENCOLLECTIVE_BASE_URL',
  'SHOW_BACK_MY_STACK',
];

module.exports = withMDX({
  env: Object.fromEntries(
    clientEnvironmentVariables
      .filter((name) => process.env[name] !== undefined)
      .map((name) => [name, process.env[name]]),
  ),
  turbopack: {
    resolveAlias: {
      // gemfile requires fs, unused when parsing a Gemfile.lock in the browser
      fs: { browser: './lib/empty.js' },
    },
    rules: {
      // Import SVG files as React components
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
});
