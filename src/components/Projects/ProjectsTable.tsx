import React from "react";
import { RxUpdate } from "react-icons/rx";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FcAlphabeticalSortingAz, FcAlphabeticalSortingZa } from "react-icons/fc";
import { FcNumericalSorting12, FcNumericalSorting21 } from "react-icons/fc";
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
    projectsData: Repo[];
    handleUpdate: (repo: Repo) => void;
    handleDelete: (repo: Repo) => void;
    onSort: (key: keyof Repo) => void;
    currentSort: { key: keyof Repo | null; order: "asc" | "desc" };
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ projectsData, handleUpdate, handleDelete, onSort, currentSort}) =>
{
  return (
    <table className="projects-table">
      <thead>
        <tr className="projects-table-header">
          <th onClick={() => onSort("owner")}>
             <span> Owner {currentSort.key === "owner" && (currentSort.order === "asc" ? <FcAlphabeticalSortingAz /> : <FcAlphabeticalSortingZa />)}
             </span>
          </th>
          <th onClick={() => onSort("name")}>
             <span> Project {currentSort.key === "name" && (currentSort.order === "asc" ? <FcAlphabeticalSortingAz /> : <FcAlphabeticalSortingZa />)}
             </span>
          </th>
          <th>URL</th>
          <th onClick={() => onSort("stars")}>
            <span> Stars {currentSort.key === "stars" && (currentSort.order === "asc" ? <FcNumericalSorting12  /> : <FcNumericalSorting21 />)}
            </span>
          </th>
          <th onClick={() => onSort("forks")}>
            <span> Forks {currentSort.key === "forks" && (currentSort.order === "asc" ? <FcNumericalSorting12  /> : <FcNumericalSorting21 />)}
            </span>
          </th>
          <th onClick={() => onSort("issues")}>
            <span> Issues {currentSort.key === "issues" && (currentSort.order === "asc" ? <FcNumericalSorting12  /> : <FcNumericalSorting21 />)}
            </span>
          </th>
          <th onClick={() => onSort("createdAt")}>
            <span> Release date {currentSort.key === "createdAt" && (currentSort.order === "asc" ? <FcNumericalSorting12  /> : <FcNumericalSorting21 />)}
            </span>
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projectsData.map((repo, index) => (
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