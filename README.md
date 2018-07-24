# Back Your Stack

Discover the open source projects your organization is using that need financial support.

## Service

The official Back Your Stack service is available from https://backyourstack.com/

## Development

Make sure you have Node.js version >= 9. We recommend using [nvm](https://github.com/creationix/nvm).

### Install

```
git clone https://github.com/opencollective/backyourstack.git
cd backyourstack
npm install
```

### Start

`npm run dev`

## Deployment

Back Your Stack is currently deployed with [Now](https://zeit.co/now).

Make sure that the following environment keys are set (uses [now secret](https://zeit.co/docs/getting-started/secrets)):

```
GITHUB_CLIENT_ID=@github_client_id
GITHUB_CLIENT_SECRET=@github_client_secret
GITHUB_GUEST_TOKEN=@github_guest_token
```

Then:

`now`
