export function ColumnManagerModal({
  columns,
  visibleColumns,
  onToggleColumn,
  onSelectAll,
  onDeselectAll,
  onClose,
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box col-manager-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-count">
            <h3>Manage Visible Columns</h3>
            <span className="col-count-badge">
              {visibleColumns.length} of {columns.length} visible
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-instruction">
            Choose which columns appear in the data table:
          </p>
          <div className="col-bulk-actions">
            <button className="btn-text-sm" onClick={onSelectAll}>
              ✓ Show All Columns
            </button>
            <button className="btn-text-sm" onClick={onDeselectAll}>
              ✕ Hide All Except First
            </button>
          </div>

          <div className="col-checkboxes-grid">
            {columns.map((col) => {
              const isChecked = visibleColumns.includes(col);
              return (
                <label key={col} className={`col-checkbox-item ${isChecked ? "active" : ""}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleColumn(col)}
                  />
                  <span className="col-name">{col}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
