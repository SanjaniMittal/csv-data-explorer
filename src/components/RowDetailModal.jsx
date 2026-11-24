import { copyToClipboard } from "../utils/csvHelpers";

export function RowDetailModal({
  row,
  rowIndex,
  totalRows,
  columns,
  columnTypes,
  onClose,
  onPrev,
  onNext,
  onToast,
}) {
  if (!row) return null;

  const handleCopyJSON = async () => {
    const success = await copyToClipboard(JSON.stringify(row, null, 2));
    if (success && onToast) {
      onToast("Row data copied to clipboard as JSON!");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box row-detail-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-count">
            <h3>Record Details</h3>
            <span className="row-number-pill">
              Row #{rowIndex + 1} of {totalRows}
            </span>
          </div>
          <div className="header-modal-actions">
            <button className="btn-secondary btn-sm" onClick={handleCopyJSON} title="Copy row as JSON">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy JSON</span>
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal-body row-detail-body">
          <div className="row-detail-grid">
            {columns.map((col) => {
              const val = row[col];
              const type = columnTypes[col] || "text";
              const isEmpty = val === null || val === undefined || String(val).trim() === "";

              return (
                <div key={col} className="detail-item">
                  <div className="detail-label-row">
                    <span className="detail-label">{col}</span>
                    <span className={`detail-type-tag type-${type}`}>{type}</span>
                  </div>
                  <div className={`detail-value ${isEmpty ? "empty-val" : ""}`}>
                    {isEmpty ? "(empty)" : String(val)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer row-detail-footer">
          <div className="row-nav-btns">
            <button
              className="btn-secondary btn-sm"
              onClick={onPrev}
              disabled={rowIndex <= 0}
            >
              ← Previous Record
            </button>
            <button
              className="btn-secondary btn-sm"
              onClick={onNext}
              disabled={rowIndex >= totalRows - 1}
            >
              Next Record →
            </button>
          </div>
          <button className="btn-primary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
