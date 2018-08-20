# FAQ

If you can't find your question below, please [help us improve this FAQ by adding it here](https://github.com/opencollective/backyourstack/blob/master/FAQ.md).

## General

### How does it work?

We look at all the public repositories of a given organization on Github.com. For each project, we look for a dependency file (today: `package.json`, `composer.json`, `packages.config`, `*.csproj`). For each dependency, we look for the open collective that is maintaining it and we surface them.

Note: a given collective is often maintaining more than one package. E.g. Babel has 163 different packages [published on npm](https://www.npmjs.com/search?q=%40babel). So [we keep a mapping for each collective of all of their published packages](https://github.com/opencollective/backyourstack/blob/master/src/data/projects.json#L623-L1380) that may be a dependency.

### What are the limitations?

Right now, we look for `package.json`, `packages.config`, `*.csproj` and `composer.json` files. We would love to support more languages and platforms, see [how to contribute](https://backyourstack.com/contributing).

### How can I list my project?

If you are not yet on Open Collective, [sign up here](https://opencollective.com/opensource/apply).

If you are already on Open Collective, make sure that you have added goals so that people know what do you need money for.
If for whatever reason your open source project doesn't show up yet, [please contact us](mailto:support@opencollective.com).

### Who's behind BackYourStack?

BackYourStack was initiated by the people at [Open Collective](https://opencollective.com).

### Is it limited to projects registered on Open Collective?

Our goal is to surface any open source project looking for financing. However, as of today, we are only supporting open source projects that are hosted on [Open Collective](https://opencollective.com/opensource).

### Is it limited to Javascript projects published on npm?

Our goal is to support any dependency managers in any languages. However, we are only detecting `npm`, `nuget` and `composer` dependencies for now. See [how to contribute](https://backyourstack.com/contributing).

## GitHub Permissions

### Why do I need to sign in with GitHub?

You don't have to. If you don't sign in with your github account, BackYourStack will only scan publicly available repositories. By authorizing BackYourStack to access your GitHub account, we will be able to also scan private repos. Note: we look for `package.json`, `packages.config`, `*.csproj` and `composer.json` files and we are not publicly exposing your dependencies.

### What if I don't want to connect my Github Account?
It's fine, you don't have to. You can also upload one or multiple `package.json`, `packages.config`, `*.csproj` and `composer.json` files.

### Why does BackYourStack need so many GitHub permissions?

BackYourStack only wants access to your private repositories and look at the content of dependency files such as `package.json`, `packages.config`, `*.csproj` and `composer.json`. To do that, the only scope we need is the [`repo`](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/#available-scopes) scope.  The `repo` scope is unfortunately very wide and includes  read and write access to all public and private repository data including: Code, Issues, Pull requests, Wikis, Settings, Webhooks and services, Deploy keys, and Collaboration invites.

TL;DR: we would love to ask for narrower permissions but Github doesn't let us do that. If that's an issue for you, use the upload functionality.

