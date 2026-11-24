import { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";

import { Header } from "./components/Header";
import { UploadZone } from "./components/UploadZone";
import { SummaryCards } from "./components/SummaryCards";
import { ActiveFilters } from "./components/ActiveFilters";
import { DataTable } from "./components/DataTable";
import { ChartSection } from "./components/ChartSection";
import { ColumnStats } from "./components/ColumnStats";
import { DataTools } from "./components/DataTools";
import { ColumnManagerModal } from "./components/ColumnManagerModal";
import { RowDetailModal } from "./components/RowDetailModal";
import { Toast } from "./components/Toast";

import { SAMPLE_DATASETS } from "./data/sampleDatasets";
import { detectColumnTypes } from "./utils/csvHelpers";

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("csv_explorer_theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("csv_explorer_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("csv_explorer_theme", "light");
    }
  }, [darkMode]);

  // Dataset states
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Navigation tab
  const [activeTab, setActiveTab] = useState("table"); // 'table' | 'charts' | 'stats' | 'tools'

  // Filtering states
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [dateFilters, setDateFilters] = useState({});

  // Sorting
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Column management via hidden list (avoids useEffect cascading renders)
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showColManager, setShowColManager] = useState(false);

  // Row Inspection Modal
  const [inspectedIndex, setInspectedIndex] = useState(null);

  // Derive column list
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Derive visible columns computed from columns and hidden list
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => !hiddenColumns.includes(col));
  }, [columns, hiddenColumns]);

  // Derive column types
  const columnTypes = useMemo(() => {
    return detectColumnTypes(data, columns);
  }, [data, columns]);

  // Trigger toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Parse CSV string or file
  const parseCSVData = (csvString, name = "dataset.csv") => {
    setLoading(true);
    setError("");

    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: "greedy",
      dynamicTyping: false,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setError("The CSV file does not contain any valid data rows.");
          setData([]);
          setFileName("");
        } else {
          setData(results.data);
          setFileName(name);
          setFilters({});
          setDateFilters({});
          setSearch("");
          setSortColumn("");
          setCurrentPage(1);
          setHiddenColumns([]);
          setActiveTab("table");
          showToast(`Successfully loaded ${results.data.length} records!`);
        }
        setLoading(false);
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setData([]);
        setFileName("");
        setLoading(false);
      },
    });
  };

  // Upload file handler
  const handleFileUpload = (file) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".csv") && !lowerName.endsWith(".tsv") && !lowerName.endsWith(".txt")) {
      setError("Please select a valid CSV or TSV file.");
      return;
    }

    setLoading(true);
    setError("");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setError("The CSV file contains no records.");
          setData([]);
          setFileName("");
        } else {
          setData(results.data);
          setFileName(file.name);
          setFilters({});
          setDateFilters({});
          setSearch("");
          setSortColumn("");
          setCurrentPage(1);
          setHiddenColumns([]);
          setActiveTab("table");
          showToast(`Loaded "${file.name}" (${results.data.length} rows)`);
        }
        setLoading(false);
      },
      error: (err) => {
        setError("Unable to read the CSV file.");
        setLoading(false);
        console.error(err);
      },
    });
  };

  // Load sample dataset
  const handleLoadSample = (sampleId) => {
    const sample = SAMPLE_DATASETS.find((s) => s.id === sampleId);
    if (!sample) return;
    parseCSVData(sample.csv, sample.filename);
  };

  // Reset / Clear dataset
  const resetUpload = () => {
    setData([]);
    setFileName("");
    setFilters({});
    setDateFilters({});
    setSearch("");
    setError("");
    setLoading(false);
    setSortColumn("");
    setSortDirection("asc");
    setCurrentPage(1);
    setHiddenColumns([]);
    setInspectedIndex(null);
  };

  // Filter modifications
  const handleFilterChange = (col, val) => {
    setFilters((prev) => ({
      ...prev,
      [col]: val,
    }));
    setCurrentPage(1);
  };

  const handleNumericFilterChange = (col, type, val) => {
    setFilters((prev) => ({
      ...prev,
      [col]: {
        ...(prev[col] || {}),
        [type]: val,
      },
    }));
    setCurrentPage(1);
  };

  const handleDateFilterChange = (col, type, val) => {
    setDateFilters((prev) => ({
      ...prev,
      [col]: {
        ...(prev[col] || {}),
        [type]: val,
      },
    }));
    setCurrentPage(1);
  };

  const handleRemoveFilter = (col, numKey) => {
    if (numKey) {
      setFilters((prev) => {
        const next = { ...prev };
        if (next[col]) {
          const updated = { ...next[col] };
          delete updated[numKey];
          if (Object.keys(updated).length === 0) {
            delete next[col];
          } else {
            next[col] = updated;
          }
        }
        return next;
      });
    } else {
      setFilters((prev) => {
        const next = { ...prev };
        delete next[col];
        return next;
      });
    }
    setCurrentPage(1);
  };

  const handleRemoveDateFilter = (col, key) => {
    setDateFilters((prev) => {
      const next = { ...prev };
      if (next[col]) {
        const updated = { ...next[col] };
        delete updated[key];
        if (Object.keys(updated).length === 0) {
          delete next[col];
        } else {
          next[col] = updated;
        }
      }
      return next;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setDateFilters({});
    setSearch("");
    setCurrentPage(1);
    showToast("Filters reset to default.");
  };

  // Sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Delete row
  const handleDeleteRow = (originalIndex) => {
    const updated = data.filter((_, idx) => idx !== originalIndex);
    setData(updated);
    showToast("Row deleted from dataset.");
  };

  // Quick filter from stats panel
  const handleQuickFilter = (col, val) => {
    handleFilterChange(col, val);
    setActiveTab("table");
    showToast(`Filtering by ${col} = "${val}"`);
  };

  // Filter and sort calculations
  const filteredData = useMemo(() => {
    return data
      .filter((row) => {
        // Global search
        if (search.trim() !== "") {
          const query = search.trim().toLowerCase();
          const match = Object.values(row).some((val) =>
            String(val ?? "").toLowerCase().includes(query)
          );
          if (!match) return false;
        }

        // Date range
        const matchDates = Object.entries(dateFilters).every(([col, range]) => {
          const cellVal = row[col];
          if (!cellVal) return false;
          const rowDate = new Date(cellVal);
          if (isNaN(rowDate.getTime())) return false;

          if (range?.from && rowDate < new Date(`${range.from}T00:00:00`)) {
            return false;
          }
          if (range?.to && rowDate > new Date(`${range.to}T23:59:59`)) {
            return false;
          }
          return true;
        });

        if (!matchDates) return false;

        // Numeric and categorical
        return Object.entries(filters).every(([col, val]) => {
          if (columnTypes[col] === "numeric") {
            const numVal = Number(row[col]);
            if (val?.min !== undefined && val.min !== "" && numVal < Number(val.min)) {
              return false;
            }
            if (val?.max !== undefined && val.max !== "" && numVal > Number(val.max)) {
              return false;
            }
            return true;
          }

          if (!val) return true;
          return String(row[col] ?? "").trim().toLowerCase() === String(val).trim().toLowerCase();
        });
      })
      .sort((a, b) => {
        if (!sortColumn) return 0;

        const valA = a[sortColumn];
        const valB = b[sortColumn];

        if (columnTypes[sortColumn] === "numeric") {
          const numA = Number(valA);
          const numB = Number(valB);
          if (!isNaN(numA) && !isNaN(numB)) {
            return sortDirection === "asc" ? numA - numB : numB - numA;
          }
        }

        const strA = String(valA ?? "").toLowerCase();
        const strB = String(valB ?? "").toLowerCase();

        if (strA < strB) return sortDirection === "asc" ? -1 : 1;
        if (strA > strB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, search, filters, dateFilters, sortColumn, sortDirection, columnTypes]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count++;
    Object.values(filters).forEach((v) => {
      if (typeof v === "object" && v !== null) {
        if (v.min) count++;
        if (v.max) count++;
      } else if (v) {
        count++;
      }
    });
    Object.values(dateFilters).forEach((r) => {
      if (r?.from) count++;
      if (r?.to) count++;
    });
    return count;
  }, [search, filters, dateFilters]);

  // Column manager toggles
  const handleToggleColumn = (col) => {
    if (hiddenColumns.includes(col)) {
      setHiddenColumns(hiddenColumns.filter((c) => c !== col));
    } else {
      if (visibleColumns.length > 1) {
        setHiddenColumns([...hiddenColumns, col]);
      } else {
        showToast("At least one column must remain visible.");
      }
    }
  };

  const handleSelectAllColumns = () => setHiddenColumns([]);
  const handleDeselectAllColumns = () => setHiddenColumns(columns.slice(1));

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        fileName={fileName}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onReset={resetUpload}
        onLoadSample={handleLoadSample}
        rowCount={data.length}
        colCount={columns.length}
      />

      <main className="app-main-content">
        {/* Upload Zone (shown when empty or always available) */}
        {data.length === 0 ? (
          <UploadZone
            onFileUpload={handleFileUpload}
            onRawCsvInput={parseCSVData}
            onLoadSample={handleLoadSample}
          />
        ) : (
          /* When dataset is loaded */
          <div className="dataset-active-container">
            {/* Summary Cards */}
            <SummaryCards
              totalRows={data.length}
              filteredRows={filteredData.length}
              columns={columns}
              columnTypes={columnTypes}
              activeFilterCount={activeFilterCount}
              onResetFilters={clearFilters}
            />

            {/* Active Filters Pill Bar */}
            <ActiveFilters
              search={search}
              onClearSearch={() => setSearch("")}
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              dateFilters={dateFilters}
              onRemoveDateFilter={handleRemoveDateFilter}
              onClearAll={clearFilters}
            />

            {/* Interactive Tab Navigation */}
            <div className="explorer-tabs-bar">
              <button
                className={`tab-btn ${activeTab === "table" ? "active" : ""}`}
                onClick={() => setActiveTab("table")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"></path>
                </svg>
                <span>Data Table</span>
                <span className="tab-count-pill">{filteredData.length}</span>
              </button>

              <button
                className={`tab-btn ${activeTab === "charts" ? "active" : ""}`}
                onClick={() => setActiveTab("charts")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Visual Charts</span>
                <span className="tab-badge-new">Interactive</span>
              </button>

              <button
                className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
                onClick={() => setActiveTab("stats")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
                <span>Column Profiler & Health</span>
                <span className="tab-count-pill">{columns.length} cols</span>
              </button>

              <button
                className={`tab-btn ${activeTab === "tools" ? "active" : ""}`}
                onClick={() => setActiveTab("tools")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                <span>Data Tools & Transform</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="tab-content-wrapper">
              {activeTab === "table" && (
                <DataTable
                  data={data}
                  filteredData={filteredData}
                  columns={columns}
                  visibleColumns={visibleColumns}
                  columnTypes={columnTypes}
                  search={search}
                  setSearch={setSearch}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handleNumericFilterChange={handleNumericFilterChange}
                  dateFilters={dateFilters}
                  handleDateFilterChange={handleDateFilterChange}
                  clearFilters={clearFilters}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  onOpenColumnManager={() => setShowColManager(true)}
                  onInspectRow={(row, idx) => setInspectedIndex(idx)}
                  onDeleteRow={handleDeleteRow}
                  onToast={showToast}
                />
              )}

              {activeTab === "charts" && (
                <ChartSection
                  data={filteredData}
                  columns={columns}
                  columnTypes={columnTypes}
                />
              )}

              {activeTab === "stats" && (
                <ColumnStats
                  data={filteredData}
                  columns={columns}
                  columnTypes={columnTypes}
                  onQuickFilter={handleQuickFilter}
                />
              )}

              {activeTab === "tools" && (
                <DataTools
                  data={data}
                  columns={columns}
                  setData={setData}
                  onToast={showToast}
                />
              )}
            </div>
          </div>
        )}

        {/* Global Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-card">
              <span className="loading-spinner-lg"></span>
              <h3>Processing CSV data...</h3>
              <p>Analyzing columns, values, and calculating statistics</p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="error-close-btn" onClick={() => setError("")}>✕</button>
          </div>
        )}
      </main>

      {/* Row Detail Inspector Modal */}
      {inspectedIndex !== null && filteredData[inspectedIndex] && (
        <RowDetailModal
          row={filteredData[inspectedIndex]}
          rowIndex={inspectedIndex}
          totalRows={filteredData.length}
          columns={columns}
          columnTypes={columnTypes}
          onClose={() => setInspectedIndex(null)}
          onPrev={() => setInspectedIndex((idx) => Math.max(0, idx - 1))}
          onNext={() => setInspectedIndex((idx) => Math.min(filteredData.length - 1, idx + 1))}
          onToast={showToast}
        />
      )}

      {/* Column Manager Modal */}
      {showColManager && (
        <ColumnManagerModal
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
          onSelectAll={handleSelectAllColumns}
          onDeselectAll={handleDeselectAllColumns}
          onClose={() => setShowColManager(false)}
        />
      )}

      {/* Global Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          CSV Data Explorer • High-performance in-browser analytics • 100% Client-Side Privacy
        </p>
      </footer>
    </div>
  );
}

export default App;
