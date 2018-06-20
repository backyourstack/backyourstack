import React from 'react';
import PropTypes from 'prop-types';

export default class DependencyTable extends React.Component {

  static propTypes = {
    dependencies: PropTypes.array.isRequired,
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
            {dependencies.map(dep => (
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
                            <a href={`https://github.com/${repo.full_name}`}>{repo.full_name}</a>
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
