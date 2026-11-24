import { useState } from "react";
import { downloadCSV, downloadJSON, downloadTSV, copyToClipboard } from "../utils/csvHelpers";

export function DataTable({
  data,
  filteredData,
  columns,
  visibleColumns,
  columnTypes,
  search,
  setSearch,
  filters,
  handleFilterChange,
  handleNumericFilterChange,
  dateFilters,
  handleDateFilterChange,
  clearFilters,
  sortColumn,
  sortDirection,
  handleSort,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  onOpenColumnManager,
  onInspectRow,
  onDeleteRow,
  onToast,
}) {
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [density, setDensity] = useState("normal"); // 'compact' | 'normal'
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Pagination math
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const indexOfLastRow = safeCurrentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Highlight matching search text
  const renderCellText = (text) => {
    if (text === null || text === undefined) return "";
    const str = String(text);
    if (!search || !search.trim()) return str;

    const query = search.trim();
    const lowerStr = str.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerStr.indexOf(lowerQuery);

    if (index === -1) return str;

    const before = str.substring(0, index);
    const match = str.substring(index, index + query.length);
    const after = str.substring(index + query.length);

    return (
      <>
        {before}
        <mark className="search-highlight">{match}</mark>
        {after}
      </>
    );
  };

  const handleExport = (format) => {
    setExportMenuOpen(false);
    if (filteredData.length === 0) {
      onToast("No filtered rows to export!");
      return;
    }

    if (format === "csv") {
      downloadCSV(filteredData, "filtered_records.csv");
      onToast("CSV exported successfully!");
    } else if (format === "json") {
      downloadJSON(filteredData, "filtered_records.json");
      onToast("JSON exported successfully!");
    } else if (format === "tsv") {
      downloadTSV(filteredData, "filtered_records.tsv");
      onToast("TSV exported successfully!");
    } else if (format === "copy") {
      const jsonStr = JSON.stringify(filteredData, null, 2);
      copyToClipboard(jsonStr).then(() => {
        onToast(`Copied ${filteredData.length} records to clipboard as JSON!`);
      });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safeCurrentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const displayedCols = columns.filter((col) => visibleColumns.includes(col));

  return (
    <div className="table-wrapper-card">
      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          {/* Search Bar */}
          <div className="search-input-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search across all columns..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="table-search-input"
            />
            {search && (
              <button
                className="search-clear-btn"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <button
            className={`btn-toolbar ${showFiltersPanel ? "active" : ""}`}
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>{showFiltersPanel ? "Hide Column Filters" : "Column Filters"}</span>
          </button>

          <button className="btn-toolbar" onClick={onOpenColumnManager}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Columns ({displayedCols.length}/{columns.length})</span>
          </button>
        </div>

        <div className="toolbar-right">
          {/* Density toggle */}
          <div className="density-toggle" title="Table row density">
            <button
              className={`density-btn ${density === "compact" ? "active" : ""}`}
              onClick={() => setDensity("compact")}
              title="Compact rows"
            >
              Compact
            </button>
            <button
              className={`density-btn ${density === "normal" ? "active" : ""}`}
              onClick={() => setDensity("normal")}
              title="Comfortable rows"
            >
              Comfortable
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="export-dropdown-wrapper">
            <button
              className="btn-primary btn-export"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={filteredData.length === 0}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export ({filteredData.length})</span>
              <span className="dropdown-arrow">▾</span>
            </button>

            {exportMenuOpen && (
              <div className="export-menu" onMouseLeave={() => setExportMenuOpen(false)}>
                <button onClick={() => handleExport("csv")}>
                  <span>📥</span> Download as CSV (.csv)
                </button>
                <button onClick={() => handleExport("json")}>
                  <span>📄</span> Download as JSON (.json)
                </button>
                <button onClick={() => handleExport("tsv")}>
                  <span>📊</span> Download as TSV (.tsv)
                </button>
                <div className="menu-divider"></div>
                <button onClick={() => handleExport("copy")}>
                  <span>📋</span> Copy Filtered Data to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Column Filter Drawer */}
      {showFiltersPanel && (
        <div className="filters-drawer">
          <div className="filters-drawer-header">
            <h4>Column Filters</h4>
            <div className="drawer-actions">
              <button className="btn-text-sm" onClick={clearFilters}>Reset Filters</button>
              <button className="btn-close-sm" onClick={() => setShowFiltersPanel(false)}>✕</button>
            </div>
          </div>
          <div className="filters-grid">
            {columns.map((column) => {
              const type = columnTypes[column] || "text";
              const isNumeric = type === "numeric";
              const isDate = type === "date";

              const uniqueValues = Array.from(
                new Set(data.map((r) => r[column]))
              ).filter((v) => v !== null && v !== undefined && String(v).trim() !== "");

              return (
                <div className="filter-item-card" key={column}>
                  <div className="filter-item-label">
                    <span>{column}</span>
                    <span className={`col-tag tag-${type}`}>{type}</span>
                  </div>

                  {isDate ? (
                    <div className="date-filter-group">
                      <input
                        type="date"
                        title="From date"
                        value={dateFilters[column]?.from || ""}
                        onChange={(e) => handleDateFilterChange(column, "from", e.target.value)}
                        className="filter-input-sm"
                      />
                      <span className="filter-sep">to</span>
                      <input
                        type="date"
                        title="To date"
                        value={dateFilters[column]?.to || ""}
                        onChange={(e) => handleDateFilterChange(column, "to", e.target.value)}
                        className="filter-input-sm"
                      />
                    </div>
                  ) : isNumeric ? (
                    <div className="numeric-filter-group">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters[column]?.min || ""}
                        onChange={(e) => handleNumericFilterChange(column, "min", e.target.value)}
                        className="filter-input-sm"
                      />
                      <span className="filter-sep">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters[column]?.max || ""}
                        onChange={(e) => handleNumericFilterChange(column, "max", e.target.value)}
                        className="filter-input-sm"
                      />
                    </div>
                  ) : (
                    <select
                      className="filter-select-sm"
                      value={filters[column] || ""}
                      onChange={(e) => handleFilterChange(column, e.target.value)}
                    >
                      <option value="">All ({uniqueValues.length} values)</option>
                      {uniqueValues.slice(0, 50).map((val, idx) => (
                        <option key={idx} value={val}>
                          {String(val)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className={`table-container ${density}`}>
        <table className="custom-table">
          <thead>
            <tr>
              <th className="th-index">#</th>
              {displayedCols.map((col) => {
                const isSorted = sortColumn === col;
                return (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className="th-sortable"
                    title={`Click to sort by ${col}`}
                  >
                    <div className="th-content">
                      <span>{col}</span>
                      <span className={`sort-icon ${isSorted ? "active" : ""}`}>
                        {isSorted ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    </div>
                  </th>
                );
              })}
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length > 0 ? (
              currentRows.map((row, idx) => {
                const originalIndex = indexOfFirstRow + idx;
                return (
                  <tr
                    key={originalIndex}
                    className="table-row-interactive"
                    onClick={() => onInspectRow(row, originalIndex)}
                  >
                    <td className="td-index">{originalIndex + 1}</td>
                    {displayedCols.map((col) => (
                      <td key={col} className="td-cell">
                        {renderCellText(row[col])}
                      </td>
                    ))}
                    <td className="td-actions" onClick={(e) => e.stopPropagation()}>
                      <div className="row-action-btns">
                        <button
                          className="btn-row-action"
                          onClick={() => onInspectRow(row, originalIndex)}
                          title="View record details"
                        >
                          👁
                        </button>
                        <button
                          className="btn-row-action btn-delete-row"
                          onClick={() => onDeleteRow(originalIndex)}
                          title="Delete this row"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={displayedCols.length + 2} className="no-records-cell">
                  <div className="empty-table-state">
                    <span className="empty-icon">🔍</span>
                    <h4>No records match the current filters</h4>
                    <p>Try modifying your search or clearing active filters.</p>
                    <button className="btn-secondary btn-sm" onClick={clearFilters}>
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="table-pagination-bar">
        <div className="pagination-info">
          <span>
            Showing <strong>{filteredData.length > 0 ? indexOfFirstRow + 1 : 0}</strong> to{" "}
            <strong>{Math.min(indexOfLastRow, filteredData.length)}</strong> of{" "}
            <strong>{filteredData.length.toLocaleString()}</strong> records
          </span>
          <div className="rows-selector-group">
            <label htmlFor="rows-select">Rows per page:</label>
            <select
              id="rows-select"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rows-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="pagination-pages">
          <button
            className="page-nav-btn"
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage === 1}
            title="First Page"
          >
            «
          </button>
          <button
            className="page-nav-btn"
            onClick={() => setCurrentPage(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            title="Previous Page"
          >
            ‹
          </button>

          {getPageNumbers().map((p) => (
            <button
              key={p}
              className={`page-num-btn ${p === safeCurrentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="page-nav-btn"
            onClick={() => setCurrentPage(safeCurrentPage + 1)}
            disabled={safeCurrentPage === totalPages}
            title="Next Page"
          >
            ›
          </button>
          <button
            className="page-nav-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage === totalPages}
            title="Last Page"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
