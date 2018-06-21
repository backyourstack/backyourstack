import React from 'react';
import PropTypes from 'prop-types';

export default class RepositoryTable extends React.Component {

  static propTypes = {
    repositories: PropTypes.array.isRequired,
  };

  render () {
    const { repositories } = this.props;

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
              <th>Name</th>
              <th>Dependencies</th>
            </tr>
          </thead>
          <tbody>
            {repositories.map(repo => (
              <tr key={repo.id}>
                <td>
                  {repo.full_name &&
                    <a href={`https://github.com/${repo.full_name}`}>{repo.full_name}</a>
                  }
                  {!repo.full_name &&
                    <span>{repo.name}</span>
                  }
                </td>
                <td>
                  {repo.dependencies.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

}
