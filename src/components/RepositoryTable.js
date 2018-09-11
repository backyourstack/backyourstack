import React from 'react';
import PropTypes from 'prop-types';

export default class RepositoryTable extends React.Component {
  static propTypes = {
    repositories: PropTypes.array.isRequired,
  };

  render() {
    const { repositories } = this.props;

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
        {repositories.length === 0 && (
          <div className="error">
            <p>Sorry, we could not detect any repositories. You can:</p>
            <ul>
              <li>check that the GitHub identifier is correct</li>
              <li>
                sign in with your GitHub account to detect private repositories
              </li>
              <li>upload configuration files from your dependency manager</li>
            </ul>
            <p>
              Something not working as expected?{' '}
              <a href="https://github.com/opencollective/backyourstack/issues">
                Report an issue
              </a>
              .
            </p>
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Language</th>
              <th>Dependencies</th>
            </tr>
          </thead>
          <tbody>
            {repositories.map(repo => (
              <tr key={repo.id}>
                <td>
                  {repo.full_name && (
                    <a href={`https://github.com/${repo.full_name}`}>
                      {repo.full_name}
                    </a>
                  )}
                  {!repo.full_name && <span>{repo.name}</span>}
                </td>
                <td>{repo.language ? repo.language : <em>Unknown</em>}</td>
                <td>{repo.dependencies.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
