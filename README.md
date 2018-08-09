# BackYourStack

Discover the open source projects your organization is using that need financial support.

## Service

The official BackYourStack service is available from https://backyourstack.com/

## Development

Make sure you have Node.js version >= 9. We recommend using [nvm](https://github.com/creationix/nvm): `nvm use`. 

### Install

```
git clone https://github.com/opencollective/backyourstack.git
cd backyourstack
npm install
```

### Start

`npm run dev`

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
