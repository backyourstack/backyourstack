import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

export default class DependencyTable extends React.Component {

  static propTypes = {
    dependencies: PropTypes.array.isRequired,
  };

  sortDependencies (dependencies) {
    return dependencies.sort((a, b) => {
      const aName = get(a, 'name');
      const bName = get(b, 'name');
      const aCollectiveName = get(a, 'project.opencollective.name');
      const bCollectiveName = get(b, 'project.opencollective.name');
      if (aCollectiveName !== bCollectiveName) {
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
    });
  }

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
        }
        table td.repos {
          font-size: 12px;
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
              <th>Core dep.</th>
              <th>Peer dep.</th>
              <th>Dev dep.</th>
              <th className="repos">Repos</th>
              <th className="opencollective">Open Collective</th>
            </tr>
          </thead>
          <tbody>
            {this.sortDependencies(dependencies).map(dep => (
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
                        <a key={`${dep.name}_${repo.id}`} href={`https://github.com/${repo.full_name}`}>
                          {repo.full_name}
                        </a>
                      ))
                      .reduce((prev, curr) => [ prev, ', ', curr ] )
                  }
                  {
                    dep.repos.length > 10 && ` and ${dep.repos.length - 10 } other(s)`
                  }
                </td>
                <td className="opencollective">
                  {dep.project && dep.project.opencollective &&
                    <a href={`https://opencollective/${dep.project.opencollective.slug}`}>
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
