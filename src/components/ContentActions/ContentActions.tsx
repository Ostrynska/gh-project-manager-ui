import { BsFilter, BsGrid, BsList, BsSearch } from "react-icons/bs";
import './ContentActions.css';

function ContentActions() {
  return (
    <div className="app-content-actions">
      <div className="search-wrapper" style={{ position: "relative" }}>
        <BsSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#fff", fontSize: 16 }} />
        <input className="search-bar" placeholder="Search..." type="text" />
      </div>
      <div className="app-content-actions-wrapper">
        <button className="action-button filter">
          <BsFilter style={{ marginRight: "4px" }} />
          Filter
        </button>
        <button className="action-button list active" title="List View">
          <BsList />
        </button>
        <button className="action-button grid" title="Grid View">
          <BsGrid />
        </button>
      </div>
    </div>
  );
}

export default ContentActions;
