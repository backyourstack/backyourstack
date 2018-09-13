<p align="center">
  <a href="https://backyourstack.com/"><img width="308" height="308" src="src/static/img/logo-og-1.png" alt="BackYourStack"></a>
</p>

[![Build Status](https://travis-ci.org/opencollective/backyourstack.svg?branch=master)](https://travis-ci.org/opencollective/backyourstack)
[![Slack Status](https://slack.opencollective.org/badge.svg)](https://slack.opencollective.org)
[![Dependency Status](https://david-dm.org/opencollective/backyourstack/status.svg)](https://david-dm.org/opencollective/backyourstack)
[![Greenkeeper badge](https://badges.greenkeeper.io/opencollective/backyourstack.svg)](https://greenkeeper.io/)
[![Backers on Open Collective](https://opencollective.com/backyourstack/backers/badge.svg)](#backers) 
[![Sponsors on Open Collective](https://opencollective.com/backyourstack/sponsors/badge.svg)](#sponsors) 

Discover the open source projects your organization is using that need financial support.

Our goal with BackYourStack is to make it easier for companies to identify the open source projects that they depend on that also need funding.

While we started with just node modules (as defined in package.json files) and with open source projects that are on Open Collective, we know that the open source community is much larger than that. That's why we would love to support more languages and platforms but for that, we need you!

Take a look at our public repository & [Contributing Guidelines](https://github.com/opencollective/backyourstack/blob/master/CONTRIBUTING.md) create or pick up issues and help us make open source more sustainable for everyone! 🙌

## Service

The official BackYourStack service is available from https://backyourstack.com/

## Development

Make sure you have Node.js version >= 10. We recommend using [nvm](https://github.com/creationix/nvm): `nvm use`.

### Install

```
git clone https://github.com/opencollective/backyourstack.git
cd backyourstack
npm install
```

### Start

`npm run dev`

### Environment Keys

In development environment, we use [dotenv](https://github.com/motdotla/dotenv) to set environment keys. To use it, create an `.env` file at the root of the repository and add environment keys in there.

#### GitHub API Keys

To allow authentication with GitHub, you'll need to set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.

You can get these keys by [registering a new oAuth application at GitHub](https://github.com/settings/applications/new). By default, the callback URL should be `http://localhost:3000/auth/github/callback`.

## Production

### Prerequisite

#### Now

BackYourStack is currently deployed with [Now](https://zeit.co/now). You will need to install [Now Desktop](https://github.com/zeit/now-desktop) or [Now CLI](https://github.com/zeit/now-cli).

Authenticate with:

`now login`

Switch to the Open Collective team account:

`now switch opencollective`

#### Secrets

Make sure that the following secrets are set (uses [now secret](https://zeit.co/docs/getting-started/secrets)):

| name                   | description |
| ---------------------- | ----------- |
| `github_client_id`     | Client id for the GitHub oAuth app |
| `github_client_secret` | Client secret for the GitHub oAuth app |
| `github_guest_token`   | GitHub access token used to process unauthenticated requests |

Eg: `now secret add github_client_id {value}`

### Deployment

First:

`now`

If everything is ok, finalize with:

`now alias`

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="graphs/contributors"><img src="https://opencollective.com/backyourstack/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/backyourstack#backer)]

<a href="https://opencollective.com/backyourstack#backers" target="_blank"><img src="https://opencollective.com/backyourstack/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/backyourstack#sponsor)]

<a href="https://opencollective.com/backyourstack/sponsor/0/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/1/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/2/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/3/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/4/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/5/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/6/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/7/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/8/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/backyourstack/sponsor/9/website" target="_blank"><img src="https://opencollective.com/backyourstack/sponsor/9/avatar.svg"></a>


