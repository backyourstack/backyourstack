import '../env';

import { get, find, filter, uniq } from 'lodash';
import { organizations } from 'thanks';

import { getProjects, getCollectives } from '../data';

const sortObject = o =>
  Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});

const getCollectiveProject = slug =>
  getProjects().then(projects =>
    find(projects, p => get(p, 'opencollective.slug') === slug),
  );

const getNpmPackagesWithOrganization = slug =>
  getCollectiveProject(slug)
    .then(project => get(project, 'packages', []))
    .then(packages => filter(packages, pkg => pkg.type === 'npm'))
    .then(packages => filter(packages, pkg => pkg.name.indexOf('/') !== -1));

const getNpmOrganizationsFromPackages = packages =>
  uniq(
    packages
      .filter(pkg => pkg.name.indexOf('/') !== -1)
      .map(pkg =>
        pkg.name
          .split('/')
          .shift()
          .replace('@', ''),
      )
      .filter(organization => !!organization),
  );

const updateOrganizations = async () => {
  const collectives = await getCollectives();

  for (const collective of collectives) {
    const npmPackagesWithOrganization = await getNpmPackagesWithOrganization(
      collective.slug,
    );
    if (npmPackagesWithOrganization && npmPackagesWithOrganization.length > 1) {
      const npmOrganizations = getNpmOrganizationsFromPackages(
        npmPackagesWithOrganization,
      );
      if (npmOrganizations && npmOrganizations.length > 0) {
        for (const npmOrganization of npmOrganizations) {
          organizations[
            npmOrganization
          ] = `https://opencollective.com/${collective.slug}`;
        }
      }
    }
  }

  console.log(sortObject(organizations));
};

updateOrganizations();
