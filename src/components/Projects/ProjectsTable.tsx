import React from "react";
import { RxUpdate } from "react-icons/rx";
import { MdOutlineDeleteOutline } from "react-icons/md";
import './ProjectsTable.css'

interface Repo {
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  issues: number;
  createdAt: string;
}

interface ProjectsTableProps {
  projectsData: Record<string, Repo>;
  handleUpdate: (repo: Repo) => void;
  handleDelete: (repo: Repo) => void;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ projectsData, handleUpdate, handleDelete }) =>
{
  return (
    <table className="projects-table">
      <thead>
        <tr className="projects-table-header">
          <th>Owner</th>
          <th>Project</th>
          <th>URL</th>
          <th>Stars</th>
          <th>Forks</th>
          <th>Issues</th>
          <th>Release date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(projectsData).map((repo, index) => (
            <tr className="projects-table-row" key={index}>
            <td>{repo.owner}</td>
            <td>{repo.name}</td>
            <td>
              <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.url}</a>
            </td>
            <td>{repo.stars}</td>
            <td>{repo.forks}</td>
            <td>{repo.issues}</td>
            <td>{Math.floor(new Date(repo.createdAt).getTime() / 1000)}</td>
            <td>
              <button className='button-81' onClick={() => handleUpdate?.(repo)}><RxUpdate /></button>
              <button className='button-81' onClick={() => handleDelete?.(repo)}><MdOutlineDeleteOutline /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsTable;