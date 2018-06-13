
const allProjects = require('../data/projects.json');

async function getProjectFromDependency(dependency) {
  return allProjects.find(project =>
    project.packages.find(pkg => pkg.name === dependency)
  );
}

const dependencyTypes = ['dependencies', 'peerDependencies', 'devDependencies'];

export async function getRawStatsWithProjectFromRepos(repos) {
  const rawStats = [];

  for (const repo of repos) {
    for (const dependency of repo.dependencies) {
      let project = await getProjectFromDependency(dependency.name);
      if (!project) {
        project = { slug: dependency.name, name: dependency.name };
      }
      if (project) {
        const id = project.slug || project.name;
        if (!rawStats[id]) {
          rawStats[id] = { id: id, project: project, 'repos': {} };
        }
        for (const dependencyType of dependencyTypes) {
          rawStats[id][dependencyType] = rawStats[id][dependencyType] || 0;
          if (dependency[dependencyType]) {
            rawStats[id][dependencyType] += dependency[dependencyType];
          }
        }
        rawStats[id]['repos'][repo.id] = repo;
      }
    }
  }

  return rawStats;
}

export function scoreAndSortRawStats(rawStats) {
  return Object.keys(rawStats)
    .map(key => ({ name: key, ... rawStats[key] }))
    .map(obj => {
      obj.repos = Object.values(obj.repos);
      return obj;
    })
    .map(entry => {
      entry.score = 0;
      for (const dependencyType of dependencyTypes) {
        if (entry[dependencyType]) {
          if (dependencyType === 'dependencies') {
             entry.score += entry[dependencyType] * 3;
           } else {
             entry.score += entry[dependencyType];
           }
        }
      }
      return entry;
    })
    .sort((a, b) =>
      a.score != b.score ? b.score - a.score : a.name.localeCompare(b.name)
    );
}
