<p align="center">
  <a href="https://backyourstack.com/"><img width="308" height="308" src="public/static/img/logo-og-1.png" alt="BackYourStack"></a>
</p>

[![CI Status](https://github.com/backyourstack/backyourstack/workflows/CI/badge.svg)](https://github.com/opencollective/opencollective-api/actions/workflows/ci.yml)
[![Dependency Status](https://david-dm.org/backyourstack/backyourstack/status.svg)](https://david-dm.org/backyourstack/backyourstack)

Discover the open source projects your organization is using that need financial
support.

Our goal with BackYourStack is to make it easier for companies to identify the
open source projects that they depend on that also need funding.

While we started with just node modules (as defined in package.json files) and
with open source projects that are on Open Collective, we know that the open
source community is much larger than that. That's why we would love to support
more languages and platforms, but for that, we need you!

Take a look at our public repository & [Contributing
Guidelines](https://github.com/backyourstack/backyourstack/blob/master/CONTRIBUTING.md)
create or pick up issues and help us make open source more sustainable for
everyone! 🙌

## Service

The official BackYourStack service is available from https://backyourstack.com/

## Development

### Prerequisites

#### Node.js

Make sure you have Node.js version >= 14. We recommend using
[nvm](https://github.com/creationix/nvm): `nvm install && nvm use`

#### GitHub API Keys

If you are not working on bugs or features that make use of the GitHub API, you
do not need to configure a set of GitHub API keys.

If you are going to work on features that make use of the GitHub API,
configuring a set of GitHub API keys will help you avoid issues related to rate
limiting. GitHub limits unauthenticated use of their API to 60 requests an hour.
Registering a new application and using the API keys provided will enable you to
make up to 5000 requests from the GitHub API per hour. You can read more
information about how GitHub handles rate limiting in their [API
Documentation.](https://developer.github.com/v3/#rate-limiting)

To allow authentication with GitHub, you'll need a set of keys for the GitHub
API. You can get these keys by [registering a new OAuth application with
GitHub](https://github.com/settings/applications/new). By default, the callback
URL should be `http://localhost:3000/auth/github/callback`.

You will need the Client ID and Client Secret provided by GitHub after you
register your application.

### Install

```
git clone https://github.com/backyourstack/backyourstack.git
cd backyourstack
npm install
```

### Store Your GitHub API Keys

We use [dotenv](https://github.com/motdotla/dotenv) to store environment
variables. If you configured a set of GitHub API keys, you will need to save
them in a .env file. In the root directory of the repository, copy
`.env.template` to `.env` and add the Client ID and Client Secret generated when
you registered your GitHub application.

### Start

`npm run dev`

This will start your local copy of BackYourStack. You can access it at
`http://localhost:3000/`

## Deployment

### Production and staging (heroku)

To deploy to production, you need to be a core member of the Open Collective
team.

#### Install the Heroku CLI

`npm install -g heroku`

#### Login on the Heroku CLI

`heroku login`

#### Configure remote

Before first deployment, configure remote:

```
git remote add staging https://git.heroku.com/backyourstack-staging.git
```

Or:

```
git remote add production https://git.heroku.com/backyourstack.git
```

#### Trigger deployment

```
npm run deploy:staging
```

Or:

```
npm run deploy:production
```

- URL: https://backyourstack.com/

## Contributing

BackYourStack is open source, and we welcome new contributions. Take a look at
the [Contributing guidelines](Contributing.md) for ways to contribute.

## License

BackYourStack is made available under the [MIT License](LICENSE).
