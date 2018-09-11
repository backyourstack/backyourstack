import { getProjects, saveProjects } from '../data';

(async () => {
  const projects = await getProjects();

  await saveProjects(projects.filter(p => p.packages && p.packages.length));
})();
