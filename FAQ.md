# FAQ

## General

### Who's behind Back Your Stack?

Back Your Stack was initiated by the people at Open Collective.

### Is it limited to projects registered on Open Collective?

No, our intent is to surface any Open Source looking for financing. However, we're technically currently only supporting Open Collective.

### Is it limited to Javascript projects published on npm?

No, our intent is to support any dependency managers in any languages. However, we're only detecting npm dependencies for now.

## GitHub Permissions

### Why do I need to sign in with GitHub?

You can sign up with GitHub to let Back Your Stack analyse your private repositories, on your personal account and in the organizations you belong to.

### Why does Back Your Stack need so many GitHub permissions?

Back Your Stack only wants access to your private repositories and look at the content of dependency files such as package.json. To do that, the only scope we need is the [`repo`](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/#available-scopes) scope.  The `repo` scope is unfortunately very wide and includes  read and write access to all public and private repository data including: Code, Issues, Pull requests, Wikis, Settings, Webhooks and services, Deploy keys, and Collaboration invites.

TL;DR: we would love to ask for narrower permissions but we can't. If you don't like it, maybe you should try the upload functionality.
