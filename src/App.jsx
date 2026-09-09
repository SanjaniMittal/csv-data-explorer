import { useState } from "react";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");

  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Upload and parse CSV
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setError("");
    setLoading(true);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      setData([]);
      setFileName("");
      setLoading(false);
      return;
    }

    setFileName(file.name);
    setFilters({});
    setSearch("");
    setSortColumn("");
    setSortDirection("asc");
    setCurrentPage(1);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setError("The CSV file does not contain any data.");
          setData([]);
          setFileName("");
        } else {
          setData(results.data);
        }

        setLoading(false);
      },

      error: (parseError) => {
        setError("Unable to read the CSV file.");
        setData([]);
        setFileName("");
        setLoading(false);
        console.error(parseError);
      },
    });
  };

  // Reset upload
  const resetUpload = () => {
    setData([]);
    setFileName("");
    setFilters({});
    setSearch("");
    setError("");
    setLoading(false);
    setSortColumn("");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  // Change text/dropdown filter
  const handleFilterChange = (column, value) => {
    setFilters((previous) => ({
      ...previous,
      [column]: value,
    }));

    setCurrentPage(1);
  };

  // Change numeric minimum/maximum filter
  const handleNumericFilterChange = (column, type, value) => {
    setFilters((previous) => ({
      ...previous,
      [column]: {
        ...(previous[column] || {}),
        [type]: value,
      },
    }));

    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearch("");
    setCurrentPage(1);
  };

  // Sort table
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  // Export filtered data
  const exportCSV = () => {
    if (filteredData.length === 0) {
      return;
    }

    const csv = Papa.unparse(filteredData);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_data.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Get column names
  const columns =
    data.length > 0 ? Object.keys(data[0]) : [];

  // Detect numeric columns
  const numericColumns =
    data.length > 0
      ? columns.filter((column) =>
          data.every(
            (row) =>
              row[column] !== null &&
              row[column] !== undefined &&
              row[column] !== "" &&
              Number.isFinite(Number(row[column]))
          )
        )
      : [];

  // Filter and sort data
  const filteredData = data
    .filter((row) => {
      // Global search
      const matchesSearch =
        search.trim() === "" ||
        Object.values(row).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        );

      if (!matchesSearch) {
        return false;
      }

      // Column filters
      return Object.entries(filters).every(
        ([column, value]) => {
          // Numeric range filtering
          if (numericColumns.includes(column)) {
            const rowValue = Number(row[column]);

            const minValue = value?.min;
            const maxValue = value?.max;

            if (
              minValue !== undefined &&
              minValue !== "" &&
              rowValue < Number(minValue)
            ) {
              return false;
            }

            if (
              maxValue !== undefined &&
              maxValue !== "" &&
              rowValue > Number(maxValue)
            ) {
              return false;
            }

            return true;
          }

          // Text/category filtering
          if (!value) {
            return true;
          }

          return (
            String(row[column] ?? "") === String(value)
          );
        }
      );
    })
    .sort((a, b) => {
      if (!sortColumn) {
        return 0;
      }

      const valueA = String(
        a[sortColumn] ?? ""
      ).toLowerCase();

      const valueB = String(
        b[sortColumn] ?? ""
      ).toLowerCase();

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPage)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const indexOfLastRow =
    safeCurrentPage * rowsPerPage;

  const indexOfFirstRow =
    indexOfLastRow - rowsPerPage;

  const currentRows = filteredData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  return (
    <div className="app">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>CSV Data Explorer</h1>
          <p>
            Upload, search, filter, sort, and analyze
            your CSV data
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-content">
          <div className="upload-icon">↑</div>

          <h2>Upload your CSV file</h2>

          <p>
            Supported format: <strong>.CSV</strong>
          </p>

          <label htmlFor="csv-upload">
            Choose CSV File
          </label>

          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Uploaded File */}
      {fileName && (
        <div className="file-info success">
          <div>
            <span>Uploaded File</span>
            <strong>{fileName}</strong>
          </div>

          <button
            className="reset-button"
            onClick={resetUpload}
          >
            Remove File
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-message">
          <span className="loading-spinner"></span>
          Processing CSV file...
        </div>
      )}

      {/* Empty State */}
      {data.length === 0 &&
        !loading &&
        !error && (
          <div className="empty-state">
            <h2>No CSV file loaded</h2>

            <p>
              Upload a CSV file above to view, search,
              filter, sort, and export your data.
            </p>
          </div>
        )}

      {/* Data Section */}
      {data.length > 0 && (
        <div className="data-section">

          <div className="section-heading">
            <h2>CSV Data</h2>
            <p>
              Explore and analyze your uploaded dataset.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">

            <div className="summary-card">
              <span>Total Records</span>
              <strong>{data.length}</strong>
            </div>

            <div className="summary-card">
              <span>Filtered Records</span>
              <strong>{filteredData.length}</strong>
            </div>

            <div className="summary-card">
              <span>Columns</span>
              <strong>{columns.length}</strong>
            </div>

          </div>

          {/* Data Controls */}
          <div className="data-controls">

            <div className="control-top">

              <div>
                <span className="control-label">
                  Records
                </span>

                <p className="record-count">
                  Showing{" "}
                  <strong>
                    {filteredData.length}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {data.length}
                  </strong>
                </p>
              </div>

              <div className="control-buttons">

                <button
                  className="clear-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>

                <button
                  className="export-button"
                  onClick={exportCSV}
                  disabled={filteredData.length === 0}
                >
                  Export Filtered Data
                </button>

              </div>

            </div>

            <div className="search-box">

              <label htmlFor="global-search">
                Search Data
              </label>

              <input
                id="global-search"
                type="text"
                placeholder="Search across all columns..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />

            </div>

          </div>

          {/* Filters */}
          <div className="filter-header">

            <div className="filter-title-row">

              <div>
                <h2 className="filter-heading">
                  Filter Data
                </h2>

                <p>
                  Use the filters below to narrow down
                  your results.
                </p>
              </div>

              <button
                className="filter-reset-button"
                onClick={clearFilters}
              >
                Reset Filters
              </button>

            </div>

          </div>

          <div className="filters">

            {columns.map((column) => {

              const uniqueValues = [
                ...new Set(
                  data.map((row) => row[column])
                ),
              ].filter(
                (value) =>
                  value !== null &&
                  value !== undefined &&
                  value !== ""
              );

              const isNumeric =
                numericColumns.includes(column);

              return (
                <div
                  className="filter"
                  key={column}
                >
                  <label>{column}</label>

                  {isNumeric ? (
                    <div className="numeric-filter">

                      <input
                        type="number"
                        placeholder="Min"
                        value={
                          filters[column]?.min || ""
                        }
                        onChange={(event) =>
                          handleNumericFilterChange(
                            column,
                            "min",
                            event.target.value
                          )
                        }
                      />

                      <input
                        type="number"
                        placeholder="Max"
                        value={
                          filters[column]?.max || ""
                        }
                        onChange={(event) =>
                          handleNumericFilterChange(
                            column,
                            "max",
                            event.target.value
                          )
                        }
                      />

                    </div>
                  ) : (
                    <select
                      value={
                        filters[column] || ""
                      }
                      onChange={(event) =>
                        handleFilterChange(
                          column,
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        All
                      </option>

                      {uniqueValues.map(
                        (value, index) => (
                          <option
                            key={index}
                            value={value}
                          >
                            {String(value)}
                          </option>
                        )
                      )}
                    </select>
                  )}
                </div>
              );
            })}

          </div>

          {/* Table */}
          <div className="table-container">

            <table>

              <thead>
                <tr>

                  <th>#</th>

                  {columns.map((column) => (
                    <th
                      key={column}
                      onClick={() =>
                        handleSort(column)
                      }
                      className="sortable-header"
                    >
                      {column}

                      {sortColumn === column && (
                        <span className="sort-arrow">
                          {sortDirection === "asc"
                            ? " ▲"
                            : " ▼"}
                        </span>
                      )}
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody>

                {currentRows.length > 0 ? (
                  currentRows.map(
                    (row, rowIndex) => (
                      <tr key={rowIndex}>

                        <td>
                          {indexOfFirstRow +
                            rowIndex +
                            1}
                        </td>

                        {columns.map(
                          (column) => (
                            <td key={column}>
                              {row[column]}
                            </td>
                          )
                        )}

                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="no-results"
                    >
                      No matching records found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="pagination">

            <div className="rows-per-page">

              <label htmlFor="rows-select">
                Rows per page
              </label>

              <select
                id="rows-select"
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(
                    Number(event.target.value)
                  );
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

            </div>

            <div className="pagination-controls">

              <button
                onClick={() =>
                  setCurrentPage(
                    safeCurrentPage - 1
                  )
                }
                disabled={safeCurrentPage === 1}
              >
                Previous
              </button>

              <span>
                Page{" "}
                <strong>
                  {safeCurrentPage}
                </strong>{" "}
                of{" "}
                <strong>
                  {totalPages}
                </strong>
              </span>

              <button
                onClick={() =>
                  setCurrentPage(
                    safeCurrentPage + 1
                  )
                }
                disabled={
                  safeCurrentPage === totalPages
                }
              >
                Next
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>
          CSV Data Explorer • Built with React
        </p>
      </footer>

    </div>
  );
}

export default App;