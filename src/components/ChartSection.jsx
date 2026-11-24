import { useState, useMemo } from "react";
import { aggregateDataForChart, getScatterPoints } from "../utils/csvHelpers";

const COLOR_PALETTES = {
  indigo: ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#3730a3", "#312e81"],
  emerald: ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#065f46", "#064e3b"],
  sunset: ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ea580c", "#c2410c", "#9a3412"],
  violet: ["#9333ea", "#a855f7", "#c084fc", "#d8b4fe", "#7e22ce", "#6b21a8", "#581c87"],
};

export function ChartSection({ data, columns, columnTypes }) {
  const numericColumns = useMemo(
    () => columns.filter((col) => columnTypes[col] === "numeric"),
    [columns, columnTypes]
  );

  const categoricalColumns = useMemo(
    () => columns.filter((col) => columnTypes[col] !== "numeric" || col.toLowerCase().includes("id") === false),
    [columns, columnTypes]
  );

  const [chartType, setChartType] = useState("bar"); // 'bar' | 'line' | 'donut' | 'scatter'
  const [xAxisCol, setXAxisCol] = useState(categoricalColumns[0] || columns[0] || "");
  const [yAxisCol, setYAxisCol] = useState(numericColumns[0] || "");
  const [aggType, setAggType] = useState(numericColumns.length > 0 ? "sum" : "count");
  const [topN, setTopN] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");
  const [paletteKey, setPaletteKey] = useState("indigo");
  const [hoveredItem, setHoveredItem] = useState(null);

  const colors = COLOR_PALETTES[paletteKey];

  // Aggregated data for bar, line, donut
  const chartData = useMemo(() => {
    if (chartType === "scatter") return [];
    return aggregateDataForChart(data, xAxisCol, yAxisCol, aggType, topN, sortOrder);
  }, [data, xAxisCol, yAxisCol, aggType, topN, sortOrder, chartType]);

  // Scatter points
  const scatterPoints = useMemo(() => {
    if (chartType !== "scatter") return [];
    const labelCol = categoricalColumns.find((c) => c !== xAxisCol && c !== yAxisCol) || columns[0];
    return getScatterPoints(data, xAxisCol, yAxisCol, labelCol, 120);
  }, [data, xAxisCol, yAxisCol, chartType, categoricalColumns, columns]);

  const totalValue = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.value, 0),
    [chartData]
  );

  const maxValue = useMemo(
    () => Math.max(...chartData.map((d) => d.value), 1),
    [chartData]
  );

  // Download chart SVG
  const handleDownloadSVG = () => {
    const svgElem = document.getElementById("analytics-chart-svg");
    if (!svgElem) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElem);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chart_${chartType}_${xAxisCol}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chart-section-card">
      {/* Chart Controls Bar */}
      <div className="chart-controls-panel">
        <div className="controls-row-top">
          {/* Chart Type Selector */}
          <div className="chart-type-selector">
            <button
              className={`type-btn ${chartType === "bar" ? "active" : ""}`}
              onClick={() => setChartType("bar")}
            >
              📊 Bar Chart
            </button>
            <button
              className={`type-btn ${chartType === "line" ? "active" : ""}`}
              onClick={() => setChartType("line")}
            >
              📈 Line / Trend
            </button>
            <button
              className={`type-btn ${chartType === "donut" ? "active" : ""}`}
              onClick={() => setChartType("donut")}
            >
              🍩 Donut / Pie
            </button>
            {numericColumns.length >= 2 && (
              <button
                className={`type-btn ${chartType === "scatter" ? "active" : ""}`}
                onClick={() => {
                  setChartType("scatter");
                  if (columnTypes[xAxisCol] !== "numeric") {
                    setXAxisCol(numericColumns[0]);
                    setYAxisCol(numericColumns[1] || numericColumns[0]);
                  }
                }}
              >
                ⚬ Scatter Plot
              </button>
            )}
          </div>

          <div className="chart-palette-picker">
            <span className="control-label-sm">Palette:</span>
            {Object.keys(COLOR_PALETTES).map((pk) => (
              <button
                key={pk}
                className={`palette-dot-btn ${paletteKey === pk ? "active" : ""}`}
                onClick={() => setPaletteKey(pk)}
                style={{ backgroundColor: COLOR_PALETTES[pk][0] }}
                title={`Theme: ${pk}`}
              />
            ))}
            <button className="btn-secondary btn-xs" onClick={handleDownloadSVG} title="Download SVG image">
              📥 Export SVG
            </button>
          </div>
        </div>

        {/* Axis & Aggregation Filters */}
        <div className="controls-row-bottom">
          <div className="ctrl-group">
            <label>{chartType === "scatter" ? "X-Axis (Numeric)" : "Group By (Category)"}</label>
            <select
              className="ctrl-select"
              value={xAxisCol}
              onChange={(e) => setXAxisCol(e.target.value)}
            >
              {(chartType === "scatter" ? numericColumns : columns).map((col) => (
                <option key={col} value={col}>
                  {col} {columnTypes[col] ? `(${columnTypes[col]})` : ""}
                </option>
              ))}
            </select>
          </div>

          {chartType !== "scatter" ? (
            <>
              <div className="ctrl-group">
                <label>Value / Metric</label>
                <select
                  className="ctrl-select"
                  value={yAxisCol}
                  onChange={(e) => {
                    setYAxisCol(e.target.value);
                    if (!e.target.value) setAggType("count");
                  }}
                >
                  <option value="">Row Count (Frequency)</option>
                  {numericColumns.map((col) => (
                    <option key={col} value={col}>
                      {col} (numeric)
                    </option>
                  ))}
                </select>
              </div>

              {yAxisCol && (
                <div className="ctrl-group">
                  <label>Aggregation</label>
                  <select
                    className="ctrl-select"
                    value={aggType}
                    onChange={(e) => setAggType(e.target.value)}
                  >
                    <option value="sum">Sum</option>
                    <option value="avg">Average</option>
                    <option value="min">Min</option>
                    <option value="max">Max</option>
                    <option value="count">Count</option>
                  </select>
                </div>
              )}

              <div className="ctrl-group">
                <label>Limit Slices</label>
                <select
                  className="ctrl-select"
                  value={topN}
                  onChange={(e) => setTopN(Number(e.target.value))}
                >
                  <option value={5}>Top 5</option>
                  <option value={10}>Top 10</option>
                  <option value={15}>Top 15</option>
                  <option value={0}>Show All</option>
                </select>
              </div>

              <div className="ctrl-group">
                <label>Sort</label>
                <select
                  className="ctrl-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                  <option value="alpha">Alphabetical</option>
                </select>
              </div>
            </>
          ) : (
            <div className="ctrl-group">
              <label>Y-Axis (Numeric)</label>
              <select
                className="ctrl-select"
                value={yAxisCol}
                onChange={(e) => setYAxisCol(e.target.value)}
              >
                {numericColumns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="chart-canvas-container">
        {chartData.length === 0 && chartType !== "scatter" ? (
          <div className="empty-chart-state">
            <p>No data available to display for the selected configuration.</p>
          </div>
        ) : chartType === "bar" ? (
          /* SVG Bar Chart */
          <div className="svg-chart-wrapper">
            <svg id="analytics-chart-svg" viewBox="0 0 800 400" className="responsive-svg">
              {/* Y Axis Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = 330 - ratio * 270;
                const val = (maxValue * ratio).toLocaleString(undefined, { maximumFractionDigits: 1 });
                return (
                  <g key={i}>
                    <line x1="70" y1={y} x2="770" y2={y} stroke="currentColor" strokeOpacity="0.12" strokeDasharray="3 3" />
                    <text x="60" y={y + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.6">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {chartData.map((d, idx) => {
                const barWidth = Math.max(14, Math.min(65, 680 / chartData.length - 12));
                const totalBarSlot = 700 / chartData.length;
                const x = 75 + idx * totalBarSlot + (totalBarSlot - barWidth) / 2;
                const barHeight = Math.max(4, (d.value / maxValue) * 270);
                const y = 330 - barHeight;
                const color = colors[idx % colors.length];
                const isHovered = hoveredItem?.category === d.category;

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredItem(d)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill={color}
                      opacity={isHovered ? 1 : 0.85}
                      stroke={isHovered ? "#fff" : "none"}
                      strokeWidth="2"
                      style={{ transition: "all 0.2s ease" }}
                    />
                    {/* Category Label */}
                    <text
                      x={x + barWidth / 2}
                      y="350"
                      textAnchor="middle"
                      fontSize="11"
                      fill="currentColor"
                      opacity="0.8"
                      transform={chartData.length > 8 ? `rotate(35, ${x + barWidth / 2}, 350)` : undefined}
                    >
                      {d.category.length > 12 ? d.category.slice(0, 11) + "…" : d.category}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredItem && (
              <div className="chart-tooltip-floating">
                <strong>{hoveredItem.category}</strong>
                <div>Value: <span>{hoveredItem.value.toLocaleString()}</span></div>
                <div>Count: <span>{hoveredItem.count} rows</span></div>
                <div>Share: <span>{totalValue > 0 ? ((hoveredItem.value / totalValue) * 100).toFixed(1) : 0}%</span></div>
              </div>
            )}
          </div>
        ) : chartType === "line" ? (
          /* SVG Line Chart */
          <div className="svg-chart-wrapper">
            <svg id="analytics-chart-svg" viewBox="0 0 800 400" className="responsive-svg">
              <defs>
                <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[0]} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={colors[0]} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = 330 - ratio * 270;
                return (
                  <g key={i}>
                    <line x1="70" y1={y} x2="770" y2={y} stroke="currentColor" strokeOpacity="0.12" strokeDasharray="3 3" />
                    <text x="60" y={y + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.6">
                      {(maxValue * ratio).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                    </text>
                  </g>
                );
              })}

              {/* Path calculation */}
              {(() => {
                const pts = chartData.map((d, idx) => {
                  const step = 700 / Math.max(1, chartData.length - 1);
                  const x = 75 + idx * step;
                  const y = 330 - (d.value / maxValue) * 270;
                  return { x, y, d };
                });

                const linePath = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
                const areaPath = pts.length > 0 ? `${linePath} L ${pts[pts.length - 1].x} 330 L ${pts[0].x} 330 Z` : "";

                return (
                  <>
                    <path d={areaPath} fill="url(#lineAreaGrad)" />
                    <path d={linePath} fill="none" stroke={colors[0]} strokeWidth="3.5" strokeLinecap="round" />
                    {pts.map((p, idx) => {
                      const isHovered = hoveredItem?.category === p.d.category;
                      return (
                        <g
                          key={idx}
                          onMouseEnter={() => setHoveredItem(p.d)}
                          onMouseLeave={() => setHoveredItem(null)}
                          style={{ cursor: "pointer" }}
                        >
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? 7 : 4.5}
                            fill={colors[0]}
                            stroke="#fff"
                            strokeWidth="2"
                          />
                          <text
                            x={p.x}
                            y="350"
                            textAnchor="middle"
                            fontSize="11"
                            fill="currentColor"
                            opacity="0.8"
                            transform={chartData.length > 8 ? `rotate(35, ${p.x}, 350)` : undefined}
                          >
                            {p.d.category.length > 12 ? p.d.category.slice(0, 11) + "…" : p.d.category}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {hoveredItem && (
              <div className="chart-tooltip-floating">
                <strong>{hoveredItem.category}</strong>
                <div>Value: <span>{hoveredItem.value.toLocaleString()}</span></div>
                <div>Count: <span>{hoveredItem.count} rows</span></div>
              </div>
            )}
          </div>
        ) : chartType === "donut" ? (
          /* SVG Donut / Pie Chart */
          <div className="donut-chart-layout">
            <div className="donut-svg-wrapper">
              <svg id="analytics-chart-svg" viewBox="0 0 400 400" className="donut-svg">
                <g transform="translate(200, 200)">
                  {(() => {
                    let cumulativeAngle = -Math.PI / 2;
                    const rOuter = 160;
                    const rInner = 95;

                    return chartData.map((d, idx) => {
                      const sliceAngle = totalValue > 0 ? (d.value / totalValue) * 2 * Math.PI : 0;
                      const startAngle = cumulativeAngle;
                      const endAngle = cumulativeAngle + sliceAngle;
                      cumulativeAngle = endAngle;

                      const x1 = Math.cos(startAngle) * rOuter;
                      const y1 = Math.sin(startAngle) * rOuter;
                      const x2 = Math.cos(endAngle) * rOuter;
                      const y2 = Math.sin(endAngle) * rOuter;

                      const x3 = Math.cos(endAngle) * rInner;
                      const y3 = Math.sin(endAngle) * rInner;
                      const x4 = Math.cos(startAngle) * rInner;
                      const y4 = Math.sin(startAngle) * rInner;

                      const largeArc = sliceAngle > Math.PI ? 1 : 0;
                      const pathData = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;

                      const isHovered = hoveredItem?.category === d.category;
                      const color = colors[idx % colors.length];

                      return (
                        <path
                          key={idx}
                          d={pathData}
                          fill={color}
                          opacity={isHovered ? 1 : 0.88}
                          stroke="#fff"
                          strokeWidth="2"
                          onMouseEnter={() => setHoveredItem(d)}
                          onMouseLeave={() => setHoveredItem(null)}
                          style={{
                            cursor: "pointer",
                            transform: isHovered ? "scale(1.04)" : "scale(1)",
                            transition: "all 0.2s ease",
                          }}
                        />
                      );
                    });
                  })()}

                  {/* Center Text */}
                  <text textAnchor="middle" y="-10" fontSize="13" fill="currentColor" opacity="0.6">
                    {yAxisCol || "Total"}
                  </text>
                  <text textAnchor="middle" y="18" fontSize="20" fontWeight="bold" fill="currentColor">
                    {totalValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </text>
                </g>
              </svg>
            </div>

            {/* Donut Legend */}
            <div className="donut-legend-list">
              <h4>Distribution ({chartData.length} slices)</h4>
              {chartData.map((d, idx) => {
                const color = colors[idx % colors.length];
                const pct = totalValue > 0 ? ((d.value / totalValue) * 100).toFixed(1) : 0;
                const isHovered = hoveredItem?.category === d.category;

                return (
                  <div
                    key={idx}
                    className={`legend-item-row ${isHovered ? "hovered" : ""}`}
                    onMouseEnter={() => setHoveredItem(d)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="legend-dot" style={{ backgroundColor: color }}></span>
                    <span className="legend-name" title={d.category}>{d.category}</span>
                    <span className="legend-pct">{pct}%</span>
                    <span className="legend-val">{d.value.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Scatter Plot */
          <div className="svg-chart-wrapper">
            <svg id="analytics-chart-svg" viewBox="0 0 800 400" className="responsive-svg">
              {(() => {
                if (scatterPoints.length === 0) return null;
                const minX = Math.min(...scatterPoints.map((p) => p.x));
                const maxX = Math.max(...scatterPoints.map((p) => p.x));
                const minY = Math.min(...scatterPoints.map((p) => p.y));
                const maxY = Math.max(...scatterPoints.map((p) => p.y));

                const rangeX = maxX - minX || 1;
                const rangeY = maxY - minY || 1;

                return (
                  <>
                    {/* Grid */}
                    {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                      const y = 330 - r * 270;
                      return (
                        <g key={i}>
                          <line x1="70" y1={y} x2="770" y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                          <text x="60" y={y + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.6">
                            {(minY + r * rangeY).toFixed(1)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Scatter Points */}
                    {scatterPoints.map((pt, i) => {
                      const cx = 75 + ((pt.x - minX) / rangeX) * 690;
                      const cy = 330 - ((pt.y - minY) / rangeY) * 270;
                      const isHovered = hoveredItem?.label === pt.label;

                      return (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : 5}
                          fill={colors[i % colors.length]}
                          opacity={isHovered ? 1 : 0.75}
                          stroke="#fff"
                          strokeWidth="1.5"
                          onMouseEnter={() => setHoveredItem(pt)}
                          onMouseLeave={() => setHoveredItem(null)}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {hoveredItem && (
              <div className="chart-tooltip-floating">
                <strong>{hoveredItem.label}</strong>
                <div>{xAxisCol}: <span>{hoveredItem.x}</span></div>
                <div>{yAxisCol}: <span>{hoveredItem.y}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
