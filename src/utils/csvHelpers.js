import Papa from "papaparse";

/**
 * Automatically inspects column values and determines data type
 */
export function detectColumnTypes(data, columns) {
  const types = {};
  if (!data || data.length === 0) return types;

  columns.forEach((col) => {
    let numericCount = 0;
    let dateCount = 0;
    let booleanCount = 0;
    let validCount = 0;

    data.forEach((row) => {
      const val = row[col];
      if (val === null || val === undefined || String(val).trim() === "") return;
      validCount++;

      const strVal = String(val).trim();

      // Check Boolean
      if (/^(true|false|yes|no)$/i.test(strVal)) {
        booleanCount++;
      }

      // Check Numeric
      if (!isNaN(Number(strVal)) && strVal !== "") {
        numericCount++;
      }

      // Check Date
      if (
        /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/.test(strVal) ||
        /^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}/.test(strVal) ||
        /^\d{1,2}-[A-Za-z]{3}-\d{4}/.test(strVal) ||
        (!isNaN(Date.parse(strVal)) && isNaN(Number(strVal)) && strVal.length >= 8)
      ) {
        dateCount++;
      }
    });

    if (validCount === 0) {
      types[col] = "text";
    } else if (numericCount / validCount >= 0.85) {
      types[col] = "numeric";
    } else if (dateCount / validCount >= 0.85) {
      types[col] = "date";
    } else if (booleanCount / validCount >= 0.85) {
      types[col] = "boolean";
    } else {
      types[col] = "text";
    }
  });

  return types;
}

/**
 * Calculates detailed statistics for a given column
 */
export function calculateColumnStats(data, column, type) {
  if (!data || data.length === 0) return null;

  const totalRows = data.length;
  const values = [];
  let nullCount = 0;

  data.forEach((row) => {
    const raw = row[column];
    if (raw === null || raw === undefined || String(raw).trim() === "") {
      nullCount++;
    } else {
      values.push(raw);
    }
  });

  const validCount = values.length;
  const completeness = ((validCount / totalRows) * 100).toFixed(1);

  if (type === "numeric") {
    const numValues = values
      .map((v) => Number(v))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    if (numValues.length === 0) {
      return { totalRows, validCount, nullCount, completeness, type: "numeric" };
    }

    const min = numValues[0];
    const max = numValues[numValues.length - 1];
    const sum = numValues.reduce((acc, n) => acc + n, 0);
    const avg = sum / numValues.length;

    const mid = Math.floor(numValues.length / 2);
    const median =
      numValues.length % 2 !== 0
        ? numValues[mid]
        : (numValues[mid - 1] + numValues[mid]) / 2;

    // Distinct count
    const uniqueCount = new Set(numValues).size;

    // Generate 6 histogram bins for mini sparkline
    const binCount = 6;
    const range = max - min || 1;
    const binSize = range / binCount;
    const bins = Array.from({ length: binCount }, (_, i) => ({
      from: min + i * binSize,
      to: min + (i + 1) * binSize,
      count: 0,
    }));

    numValues.forEach((val) => {
      let bIdx = Math.floor((val - min) / binSize);
      if (bIdx >= binCount) bIdx = binCount - 1;
      bins[bIdx].count++;
    });

    return {
      type: "numeric",
      totalRows,
      validCount,
      nullCount,
      completeness,
      uniqueCount,
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      sum: Number(sum.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      median: Number(median.toFixed(2)),
      bins,
    };
  }

  // Categorical, boolean or text
  const freqMap = {};
  values.forEach((v) => {
    const s = String(v).trim();
    freqMap[s] = (freqMap[s] || 0) + 1;
  });

  const sortedFreq = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .map(([val, count]) => ({
      value: val,
      count,
      pct: ((count / (validCount || 1)) * 100).toFixed(1),
    }));

  return {
    type: type || "text",
    totalRows,
    validCount,
    nullCount,
    completeness,
    uniqueCount: Object.keys(freqMap).length,
    topValues: sortedFreq.slice(0, 8),
  };
}

/**
 * Aggregates dataset records for dynamic chart rendering
 */
export function aggregateDataForChart(data, xCol, yCol, aggType = "count", topN = 10, sortOrder = "desc") {
  if (!data || data.length === 0 || !xCol) return [];

  const groups = {};

  data.forEach((row) => {
    const rawKey = row[xCol];
    const key = rawKey === null || rawKey === undefined || String(rawKey).trim() === ""
      ? "(Blank)"
      : String(rawKey).trim();

    if (!groups[key]) {
      groups[key] = { count: 0, values: [] };
    }

    groups[key].count++;

    if (yCol && row[yCol] !== undefined && row[yCol] !== "") {
      const num = Number(row[yCol]);
      if (!isNaN(num)) {
        groups[key].values.push(num);
      }
    }
  });

  const result = Object.entries(groups).map(([category, info]) => {
    let computedVal = 0;
    if (aggType === "count" || !yCol) {
      computedVal = info.count;
    } else if (info.values.length > 0) {
      if (aggType === "sum") {
        computedVal = info.values.reduce((a, b) => a + b, 0);
      } else if (aggType === "avg") {
        computedVal = info.values.reduce((a, b) => a + b, 0) / info.values.length;
      } else if (aggType === "min") {
        computedVal = Math.min(...info.values);
      } else if (aggType === "max") {
        computedVal = Math.max(...info.values);
      }
    }

    return {
      category,
      value: Number(computedVal.toFixed(2)),
      count: info.count,
    };
  });

  if (sortOrder === "desc") {
    result.sort((a, b) => b.value - a.value);
  } else if (sortOrder === "asc") {
    result.sort((a, b) => a.value - b.value);
  } else if (sortOrder === "alpha") {
    result.sort((a, b) => a.category.localeCompare(b.category));
  }

  if (topN && topN > 0 && result.length > topN) {
    const sliced = result.slice(0, topN);
    const rest = result.slice(topN);
    const restVal = rest.reduce((sum, item) => sum + item.value, 0);
    sliced.push({
      category: "Other (" + rest.length + " more)",
      value: Number(restVal.toFixed(2)),
      count: rest.reduce((sum, item) => sum + item.count, 0),
    });
    return sliced;
  }

  return result;
}

/**
 * Prepares 2D data for Scatter Plot (X numeric vs Y numeric)
 */
export function getScatterPoints(data, xCol, yCol, labelCol, limit = 150) {
  if (!data || !xCol || !yCol) return [];

  const points = [];
  for (let i = 0; i < data.length && points.length < limit; i++) {
    const row = data[i];
    const xVal = Number(row[xCol]);
    const yVal = Number(row[yCol]);
    if (!isNaN(xVal) && !isNaN(yVal)) {
      points.push({
        x: xVal,
        y: yVal,
        label: labelCol ? String(row[labelCol] || "") : `#${i + 1}`,
        row,
      });
    }
  }
  return points;
}

/**
 * Downloads data as CSV file
 */
export function downloadCSV(data, filename = "filtered_data.csv") {
  if (!data || data.length === 0) return;
  const csv = Papa.unparse(data);
  triggerDownload(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Downloads data as formatted JSON
 */
export function downloadJSON(data, filename = "dataset.json") {
  if (!data || data.length === 0) return;
  const jsonStr = JSON.stringify(data, null, 2);
  triggerDownload(jsonStr, filename, "application/json;charset=utf-8;");
}

/**
 * Downloads data as TSV (Tab Separated Values)
 */
export function downloadTSV(data, filename = "data.tsv") {
  if (!data || data.length === 0) return;
  const tsv = Papa.unparse(data, { delimiter: "\t" });
  triggerDownload(tsv, filename, "text/tab-separated-values;charset=utf-8;");
}

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Safely copies text to user's clipboard
 */
export async function copyToClipboard(text) {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch {
    document.body.removeChild(textArea);
    return false;
  }
}
