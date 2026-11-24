export function SummaryCards({
  totalRows,
  filteredRows,
  columns,
  columnTypes,
  activeFilterCount,
  onResetFilters,
}) {
  const numericCount = Object.values(columnTypes).filter((t) => t === "numeric").length;
  const textCount = Object.values(columnTypes).filter((t) => t === "text").length;
  const dateCount = Object.values(columnTypes).filter((t) => t === "date").length;

  const matchPct = totalRows > 0 ? ((filteredRows / totalRows) * 100).toFixed(0) : 100;

  return (
    <div className="summary-cards-grid">
      {/* Total Records */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-label">Total Records</span>
          <div className="summary-icon icon-blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        </div>
        <div className="summary-value">{totalRows.toLocaleString()}</div>
        <div className="summary-subtext">100% of uploaded dataset</div>
      </div>

      {/* Filtered Records */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-label">Filtered Results</span>
          <div className="summary-icon icon-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </div>
        </div>
        <div className="summary-value-row">
          <span className="summary-value">{filteredRows.toLocaleString()}</span>
          <span className={`summary-badge ${matchPct < 100 ? "badge-active" : ""}`}>
            {matchPct}% visible
          </span>
        </div>
        <div className="summary-subtext">
          {totalRows - filteredRows > 0 ? `${(totalRows - filteredRows).toLocaleString()} rows hidden by filters` : "All records match"}
        </div>
      </div>

      {/* Columns */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-label">Columns Detected</span>
          <div className="summary-icon icon-purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </div>
        </div>
        <div className="summary-value">{columns.length}</div>
        <div className="summary-type-pills">
          {numericCount > 0 && <span className="type-pill pill-num">{numericCount} numeric</span>}
          {textCount > 0 && <span className="type-pill pill-txt">{textCount} text</span>}
          {dateCount > 0 && <span className="type-pill pill-date">{dateCount} date</span>}
        </div>
      </div>

      {/* Active Filter State */}
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-label">Active Filters</span>
          <div className="summary-icon icon-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
        <div className="summary-value">{activeFilterCount}</div>
        <div className="summary-subtext">
          {activeFilterCount > 0 ? (
            <button className="summary-inline-reset" onClick={onResetFilters}>
              Reset all conditions ✕
            </button>
          ) : (
            "No filter conditions applied"
          )}
        </div>
      </div>
    </div>
  );
}
