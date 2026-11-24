import { SAMPLE_DATASETS } from "../data/sampleDatasets";

export function Header({
  fileName,
  darkMode,
  setDarkMode,
  onReset,
  onLoadSample,
  rowCount,
  colCount,
}) {
  return (
    <header className="page-header">
      <div className="header-left">
        <div className="logo-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div>
          <div className="header-title-row">
            <h1>CSV Data Explorer</h1>
            <span className="version-pill">v2.0 Interactive</span>
          </div>
          <p className="header-subtitle">
            Instant browser-based analytics, visual charts, filtering, and data profiling
          </p>
        </div>
      </div>

      <div className="header-actions">
        {rowCount > 0 && (
          <div className="dataset-meta-badge">
            <span className="dot"></span>
            <strong>{rowCount.toLocaleString()}</strong> rows • <strong>{colCount}</strong> cols
          </div>
        )}

        <div className="sample-dropdown-wrapper">
          <select
            className="sample-select"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onLoadSample(e.target.value);
                e.target.value = "";
              }
            }}
          >
            <option value="" disabled>⚡ Try Sample Dataset...</option>
            {SAMPLE_DATASETS.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.title} ({ds.badge})
              </option>
            ))}
          </select>
        </div>

        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>

        {fileName && (
          <button className="reset-btn-top" onClick={onReset} title="Clear current dataset">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Close File</span>
          </button>
        )}
      </div>
    </header>
  );
}
