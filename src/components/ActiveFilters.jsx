export function ActiveFilters({
  search,
  onClearSearch,
  filters,
  onRemoveFilter,
  dateFilters,
  onRemoveDateFilter,
  onClearAll,
}) {
  const activeEntries = [];

  if (search && search.trim() !== "") {
    activeEntries.push({
      type: "search",
      label: `Search: "${search}"`,
      onRemove: onClearSearch,
    });
  }

  Object.entries(filters).forEach(([col, val]) => {
    if (typeof val === "object" && val !== null) {
      if (val.min !== undefined && val.min !== "") {
        activeEntries.push({
          type: "num-min",
          label: `${col} ≥ ${val.min}`,
          onRemove: () => onRemoveFilter(col, "min"),
        });
      }
      if (val.max !== undefined && val.max !== "") {
        activeEntries.push({
          type: "num-max",
          label: `${col} ≤ ${val.max}`,
          onRemove: () => onRemoveFilter(col, "max"),
        });
      }
    } else if (val !== undefined && val !== "") {
      activeEntries.push({
        type: "select",
        label: `${col} = "${val}"`,
        onRemove: () => onRemoveFilter(col),
      });
    }
  });

  Object.entries(dateFilters).forEach(([col, range]) => {
    if (range?.from) {
      activeEntries.push({
        type: "date-from",
        label: `${col} from ${range.from}`,
        onRemove: () => onRemoveDateFilter(col, "from"),
      });
    }
    if (range?.to) {
      activeEntries.push({
        type: "date-to",
        label: `${col} to ${range.to}`,
        onRemove: () => onRemoveDateFilter(col, "to"),
      });
    }
  });

  if (activeEntries.length === 0) return null;

  return (
    <div className="active-filters-bar">
      <div className="active-filters-header">
        <span className="active-filters-title">Active Filters ({activeEntries.length}):</span>
      </div>
      <div className="active-pills-list">
        {activeEntries.map((item, idx) => (
          <span key={idx} className="filter-pill">
            <span className="pill-text">{item.label}</span>
            <button
              className="pill-remove-btn"
              onClick={item.onRemove}
              title="Remove this filter"
              aria-label="Remove filter"
            >
              ×
            </button>
          </span>
        ))}
        <button className="clear-all-pills-btn" onClick={onClearAll}>
          Reset All
        </button>
      </div>
    </div>
  );
}
