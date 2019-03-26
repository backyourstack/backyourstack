# Updating Data

## Updating collectives

```
npm run update-collectives
npx prettier src/data/collectives.json --write
git add src/data/collectives.json
git commit -m "data(collectives): update"
```

## Detecting new packages

```
npm run detect-packages
npx babel-node src/scripts/remove-projects-without-packages
npx prettier src/data/projects.json --write
```

Use an efficient tool to do code reviews and stage the relevant changes. We recommend 'Sublime Merge'.

This is not easy. Review the staged changes one more time.

```
git commit -m "data(projects): update"
```

## Syncing project with Open Collective

```
npm run sync-projects-with-opencollective
npx prettier src/data/projects.json --write
git add src/data/projects.json
git commit -m "data(projects): sync with opencollective"
```
