import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

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

  render () {
    const { dependencies } = this.props;

    return (
      <div>
        <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table th, table td {
          border: 1px solid #333;
          padding: 0.5em;
          white-space: nowrap;
          font-size: 12px;
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
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th><abbr title="Core dependency count">Core dep.</abbr></th>
              <th><abbr title="Peer dependency count">Peer dep.</abbr></th>
              <th><abbr title="Dev dependency count">Dev dep.</abbr></th>
              <th className="repos">Repos</th>
              <th className="opencollective">Open Collective</th>
            </tr>
          </thead>
          <tbody>
            {dependencies.sort(this.sortDependencies).map(dep => (
              <tr key={dep.name}>
                <td>{dep.type}</td>
                <td>{dep.name}</td>
                <td>{dep.dependencies}</td>
                <td>{dep.peerDependencies}</td>
                <td>{dep.devDependencies}</td>
                <td className="repos">
                  {
                    dep.repos
                      .slice(0, 10)
                      .map(repo => (
                        <span key={`${dep.name}_${repo.id}`}>
                          {repo.full_name &&
                            <a href={`https://github.com/${repo.full_name}`}>{repo.name}</a>
                          }
                          {!repo.full_name &&
                            <span>{repo.name}</span>
                          }
                        </span>
                      ))
                      .reduce((prev, curr) => [ prev, ', ', curr ] )
                  }
                  {
                    dep.repos.length > 10 && ` and ${dep.repos.length - 10 } other(s)`
                  }
                </td>
                <td className="opencollective">
                  {dep.project && dep.project.opencollective &&
                    <a href={`https://opencollective.com/${dep.project.opencollective.slug}`}>
                      {dep.project.opencollective.name}
                    </a>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

}
