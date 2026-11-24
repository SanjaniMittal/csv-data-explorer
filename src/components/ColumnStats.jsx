import { useMemo } from "react";
import { calculateColumnStats } from "../utils/csvHelpers";

export function ColumnStats({ data, columns, columnTypes, onQuickFilter }) {
  const statsList = useMemo(() => {
    return columns.map((col) => {
      const type = columnTypes[col] || "text";
      const stats = calculateColumnStats(data, col, type);
      return { col, type, stats };
    });
  }, [data, columns, columnTypes]);

  return (
    <div className="stats-section-container">
      <div className="stats-header">
        <div>
          <h3>Dataset Health & Column Profiling</h3>
          <p>
            Statistical breakdown, completeness, distribution histograms, and frequency analysis
          </p>
        </div>
        <div className="stats-header-badge">
          {columns.length} columns analyzed across {data.length.toLocaleString()} rows
        </div>
      </div>

      <div className="stats-cards-grid">
        {statsList.map(({ col, type, stats }) => {
          if (!stats) return null;

          return (
            <div key={col} className="column-stat-card">
              <div className="stat-card-header">
                <div>
                  <h4 className="col-title" title={col}>{col}</h4>
                  <span className={`col-type-tag type-${type}`}>{type}</span>
                </div>
                <div className="completeness-badge" title={`${stats.completeness}% filled`}>
                  {stats.completeness}%
                </div>
              </div>

              {/* Completeness Bar */}
              <div className="completeness-progress-track">
                <div
                  className="completeness-progress-fill"
                  style={{
                    width: `${stats.completeness}%`,
                    backgroundColor: Number(stats.completeness) > 90 ? "#10b981" : "#f59e0b",
                  }}
                />
              </div>

              <div className="stat-meta-row">
                <span>Unique: <strong>{stats.uniqueCount}</strong></span>
                <span>Nulls: <strong>{stats.nullCount}</strong></span>
                <span>Valid: <strong>{stats.validCount}</strong></span>
              </div>

              {/* Numeric breakdown */}
              {type === "numeric" && (
                <div className="numeric-stats-block">
                  <div className="stat-pills-grid">
                    <div className="stat-pill">
                      <span className="pill-k">Min</span>
                      <span className="pill-v">{stats.min?.toLocaleString()}</span>
                    </div>
                    <div className="stat-pill">
                      <span className="pill-k">Max</span>
                      <span className="pill-v">{stats.max?.toLocaleString()}</span>
                    </div>
                    <div className="stat-pill">
                      <span className="pill-k">Avg</span>
                      <span className="pill-v">{stats.avg?.toLocaleString()}</span>
                    </div>
                    <div className="stat-pill">
                      <span className="pill-k">Median</span>
                      <span className="pill-v">{stats.median?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Sparkline Histogram */}
                  {stats.bins && stats.bins.length > 0 && (
                    <div className="sparkline-container" title="Value distribution histogram">
                      <span className="sparkline-label">Distribution:</span>
                      <div className="sparkline-bars">
                        {(() => {
                          const maxCount = Math.max(...stats.bins.map((b) => b.count), 1);
                          return stats.bins.map((b, i) => {
                            const barHeight = Math.max(3, (b.count / maxCount) * 32);
                            return (
                              <div
                                key={i}
                                className="spark-bar"
                                style={{ height: `${barHeight}px` }}
                                title={`Range [${b.from.toFixed(1)} - ${b.to.toFixed(1)}]: ${b.count} rows`}
                              />
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Categorical breakdown */}
              {type !== "numeric" && stats.topValues && (
                <div className="categorical-stats-block">
                  <div className="top-values-header">
                    <span>Top Values</span>
                    <span className="hint-text">Click to filter</span>
                  </div>
                  <div className="top-values-list">
                    {stats.topValues.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="top-value-row"
                        onClick={() => onQuickFilter(col, item.value)}
                        title={`Filter table by ${col} = "${item.value}"`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="top-value-bar-bg" style={{ width: `${item.pct}%` }} />
                        <div className="top-value-content">
                          <span className="val-text">{item.value || "(blank)"}</span>
                          <span className="val-count">{item.count} ({item.pct}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
