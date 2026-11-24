import { useState } from "react";
import { copyToClipboard } from "../utils/csvHelpers";

export function DataTools({
  data,
  columns,
  setData,
  onToast,
}) {
  // Find & Replace state
  const [selectedCol, setSelectedCol] = useState(columns[0] || "");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  // Add Row state
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState({});

  // Find & Replace Handler
  const handleFindReplace = () => {
    if (!selectedCol || !findText) {
      onToast("Please select a column and enter text to find.");
      return;
    }

    let matchCount = 0;
    const updated = data.map((row) => {
      const cellVal = String(row[selectedCol] ?? "");
      if (cellVal.includes(findText)) {
        matchCount++;
        const replaced = cellVal.replaceAll(findText, replaceText);
        return { ...row, [selectedCol]: replaced };
      }
      return row;
    });

    if (matchCount === 0) {
      onToast(`No occurrences of "${findText}" found in column "${selectedCol}".`);
      return;
    }

    setData(updated);
    onToast(`Replaced ${matchCount} occurrence(s) in "${selectedCol}".`);
    setFindText("");
    setReplaceText("");
  };

  // Remove duplicate rows
  const handleRemoveDuplicates = () => {
    const seen = new Set();
    const unique = [];

    data.forEach((row) => {
      const key = JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(row);
      }
    });

    const removedCount = data.length - unique.length;
    if (removedCount === 0) {
      onToast("No duplicate rows found.");
    } else {
      setData(unique);
      onToast(`Removed ${removedCount} duplicate row(s)!`);
    }
  };

  // Add new row submit
  const handleAddRowSubmit = (e) => {
    e.preventDefault();
    setData([newRowData, ...data]);
    setShowAddRowModal(false);
    setNewRowData({});
    onToast("New record inserted at the top of the dataset!");
  };

  // Copy Markdown Table
  const handleCopyMarkdown = async () => {
    if (data.length === 0) return;
    const headerLine = `| ${columns.join(" | ")} |`;
    const separatorLine = `| ${columns.map(() => "---").join(" | ")} |`;
    const rowsLines = data.slice(0, 100).map((row) => `| ${columns.map((c) => String(row[c] ?? "")).join(" | ")} |`);
    const mdTable = [headerLine, separatorLine, ...rowsLines].join("\n");

    const success = await copyToClipboard(mdTable);
    if (success) {
      onToast(`Copied first ${Math.min(100, data.length)} rows as Markdown table!`);
    }
  };

  return (
    <div className="data-tools-container">
      <div className="tools-grid">
        {/* Find & Replace Card */}
        <div className="tool-card">
          <div className="tool-card-header">
            <div className="tool-icon">🔍</div>
            <div>
              <h4>Find & Replace</h4>
              <p>Quickly replace strings or incorrect entries within any column</p>
            </div>
          </div>
          <div className="tool-card-body">
            <div className="tool-field">
              <label>Target Column</label>
              <select
                className="tool-input"
                value={selectedCol}
                onChange={(e) => setSelectedCol(e.target.value)}
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <div className="tool-field">
              <label>Find Text</label>
              <input
                type="text"
                className="tool-input"
                placeholder="e.g. Completed"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
            </div>
            <div className="tool-field">
              <label>Replace With</label>
              <input
                type="text"
                className="tool-input"
                placeholder="e.g. Verified"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
            <button
              className="btn-primary tool-action-btn"
              onClick={handleFindReplace}
              disabled={!findText}
            >
              Replace in Dataset
            </button>
          </div>
        </div>

        {/* Dataset Hygiene & Modifications */}
        <div className="tool-card">
          <div className="tool-card-header">
            <div className="tool-icon">🧹</div>
            <div>
              <h4>Data Hygiene & Records</h4>
              <p>Deduplicate, insert new rows, or clean anomalies</p>
            </div>
          </div>
          <div className="tool-card-body hygiene-body">
            <div className="hygiene-action-item">
              <div>
                <strong>Deduplicate Dataset</strong>
                <p>Scans the dataset and removes identical duplicate rows.</p>
              </div>
              <button className="btn-secondary" onClick={handleRemoveDuplicates}>
                Remove Duplicates
              </button>
            </div>

            <div className="hygiene-action-item">
              <div>
                <strong>Insert New Record</strong>
                <p>Add a new entry directly into your current dataset.</p>
              </div>
              <button className="btn-primary" onClick={() => setShowAddRowModal(true)}>
                + Add Record
              </button>
            </div>

            <div className="hygiene-action-item">
              <div>
                <strong>Markdown Table Export</strong>
                <p>Copy formatted GitHub/Docs Markdown table to clipboard.</p>
              </div>
              <button className="btn-secondary" onClick={handleCopyMarkdown}>
                Copy as Markdown
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Row Modal */}
      {showAddRowModal && (
        <div className="modal-backdrop" onClick={() => setShowAddRowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Insert New Record</h3>
              <button className="close-btn" onClick={() => setShowAddRowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddRowSubmit}>
              <div className="modal-body add-row-grid">
                {columns.map((col) => (
                  <div key={col} className="add-field-group">
                    <label>{col}</label>
                    <input
                      type="text"
                      className="tool-input"
                      value={newRowData[col] || ""}
                      onChange={(e) => setNewRowData({ ...newRowData, [col]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddRowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Insert Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
