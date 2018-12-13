import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { get } from 'lodash';

import { Link } from '../routes';

import List from '../components/List';

const ocWebsiteUrl = process.env.WEBSITE_URL || 'https://opencollective.com';

export default class DependencyTable extends React.Component {
  static propTypes = {
    dependencies: PropTypes.array.isRequired,
  };

  sortDependencies = (a, b) => {
    const aName = get(a, 'name');
    const bName = get(b, 'name');
    const aCollectiveName = get(a, 'project.opencollective.name');
    const bCollectiveName = get(b, 'project.opencollective.name');
    if (aCollectiveName === bCollectiveName) {
      return aName.localeCompare(bName);
    } else if (aCollectiveName && bCollectiveName) {
      return aCollectiveName.localeCompare(bCollectiveName);
    } else if (aCollectiveName) {
      return -1;
    } else if (bCollectiveName) {
      return +1;
    } else {
      return aName.localeCompare(bName);
    }
  };

  githubRepoItem = repo => (
    <span key={repo.id}>
      {repo.full_name && (
        <a href={`https://github.com/${repo.full_name}`}>{repo.name}</a>
      )}
      {!repo.full_name && <span>{repo.name}</span>}
    </span>
  );

  render() {
    const { dependencies } = this.props;

    return (
      <div>
        <style jsx>
          {`
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table th,
            table td {
              border: 1px solid #c1c6cc;
              padding: 0.5em;
              white-space: nowrap;
              font-size: 12px;
              color: #121314;
            }
            table td.repos {
              white-space: normal;
            }
            table td a {
              color: inherit;
            }
            table td a:hover {
              text-decoration: none;
            }
          `}
        </style>
        {dependencies.length === 0 && (
          <div className="error">
            <p>Sorry, we could not detect any dependencies. </p>
            <p>
              We currently support JavaScript (NPM), PHP (Composer), .NET
              (Nuget) and Go (dep).
            </p>
            <p>
              Want so see something else?{' '}
              <Link route="contributing">
                <a>See how to contribute</a>
              </Link>
              . Something not working as expected?{' '}
              <a href="https://github.com/opencollective/backyourstack/issues">
                Report an issue
              </a>
              .
            </p>
          </div>
        )}
        {dependencies.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>
                  <abbr title="Core dependency count">Core dep.</abbr>
                </th>
                <th>
                  <abbr title="Peer dependency count">Peer dep.</abbr>
                </th>
                <th>
                  <abbr title="Dev dependency count">Dev dep.</abbr>
                </th>
                <th>
                  <abbr title="Engines dependency count">Engines dep.</abbr>
                </th>
                <th className="repos">Repos</th>
                <th className="funding">Funding</th>
              </tr>
            </thead>
            <tbody>
              {dependencies.sort(this.sortDependencies).map(dep => (
                <tr key={dep.name}>
                  <td>{dep.type}</td>
                  <td>{dep.name}</td>
                  <td>{dep.core}</td>
                  <td>{dep.peer}</td>
                  <td>{dep.dev}</td>
                  <td>{dep.engines}</td>
                  <td className="repos">
                    <List
                      array={dep.repos}
                      map={this.githubRepoItem}
                      cut={20}
                    />
                  </td>
                  <td className="opencollective">
                    {dep.project && dep.project.opencollective && (
                      <Fragment>
                        {dep.project.opencollective.pledge && (
                          <span>Add a pledge on Open Collective</span>
                        )}
                        {!dep.project.opencollective.pledge && (
                          <span>Contribute on Open Collective</span>
                        )}
                        :&nbsp;
                        <a
                          href={`https://opencollective.com/${
                            dep.project.opencollective.slug
                          }`}
                        >
                          {dep.project.opencollective.name}
                        </a>
                      </Fragment>
                    )}
                    {dep.project &&
                      dep.project.github &&
                      !dep.project.opencollective && (
                        <Fragment>
                          <span>Create first pledge on Open Collective</span>
                          :&nbsp;
                          <a
                            href={`${ocWebsiteUrl}/pledges/new?${queryString.stringify(
                              {
                                name: dep.project.name,
                                githubHandle:
                                  dep.project.github.org ||
                                  dep.project.github.repo,
                              },
                            )})`}
                          >
                            {dep.project.name}
                          </a>
                        </Fragment>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
