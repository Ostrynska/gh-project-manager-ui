import "./SearchBar.css"

interface SearchBarProps {
  input: string;
  setInput: (value: string) => void;
  onAdd: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ input, setInput, onAdd }) => {
  return (
 <div className="header-bar">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-inactive">Dashboard</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-active">Home</span>
      </div>

      {/* Search + Button */}
      <div className="search-container">
        <div className="search-wrapper">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
          </svg>
          <input className="search-input" type="text" placeholder="Facebook/React" value={input}
          onChange={(e) => setInput(e.target.value)} />
        </div>
        <button className="button-31" onClick={onAdd}>Add Project</button>
      </div>
    </div>
  );
};
