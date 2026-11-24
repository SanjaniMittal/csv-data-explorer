# CSV Data Explorer 📊

An advanced, interactive React web application that empowers users to explore, filter, visualize, analyze, and transform CSV datasets entirely in the browser with zero server setup or data privacy concerns.

![CSV Data Explorer](https://img.shields.io/badge/React-19-blue.svg) ![Vite-8](https://img.shields.io/badge/Vite-8-purple.svg) ![Client--Side-100%25-green.svg](https://img.shields.io/badge/Client--Side-100%25-green.svg)

---

## 🚀 Live Demo

Explore the live application directly in your browser:

👉 **[https://sanjanimittal.github.io/csv-data-explorer/](https://sanjanimittal.github.io/csv-data-explorer/)**

---

## 🌟 Key Interactive Features

### ⚡ 1-Click Instant Exploration
* **Pre-loaded Demo Datasets**: Jump in immediately without hunting for a file:
  * 🌐 *Global Tech & Retail Sales* (Multi-regional revenue, profit margins, product categories)
  * 👥 *Employee Directory & Compensation* (Department, salary, ratings, remote status)
  * 🌍 *Global Cities Climate & Sustainability* (Temperature, AQI, renewable energy %)
* **Drag-and-Drop Zone**: Smooth drag-and-drop CSV upload with visual feedback.
* **Paste Raw CSV Modal**: Directly paste raw CSV/TSV text with 1-click parsing.

### 📊 Dynamic Visual Analytics (Charts)
* **Interactive SVG Charts**:
  * 📊 **Bar Chart**: Compare metrics across categories with hover tooltips and dynamic scaling.
  * 📈 **Line / Trend Chart**: Visualize sequential or time-series data with smooth gradient fills and hover points.
  * 🍩 **Donut / Pie Chart**: Dynamic distribution slices with hover expansion, percentages, and interactive legend.
  * ⚬ **Scatter Plot**: 2D numeric correlation between any two continuous variables.
* **Chart Customization**:
  * Dimension (Group by) & Metric selector
  * Aggregations: `Sum`, `Average`, `Min`, `Max`, `Count`
  * Slices limiter: `Top 5`, `Top 10`, `Top 15`, `All`
  * Dynamic sorting: `Highest First`, `Lowest First`, `Alphabetical`
  * 🎨 **Color Themes**: Indigo Blue, Emerald Green, Sunset Orange, Violet Purple
  * 📥 **Export SVG**: Download generated chart directly as vector graphics.

### 🩺 Data Profiling & Column Health
* **Type Auto-Detection**: Accurately classifies columns as `Numeric`, `Date`, `Boolean`, or `Text`.
* **Completeness Meter**: Progress bar showing valid vs missing/null values for each column.
* **Numeric Summaries**: Instant calculations for `Min`, `Max`, `Average`, `Median`, `Sum`, and a **mini sparkline histogram**.
* **Categorical Frequency**: Top values with distribution percentages. **Clicking any value directly filters the table!**

### 🔎 Advanced Filtering & Table Interactivity
* **Global Search with Keyword Highlighting**: Matching search terms are visually highlighted directly in the table cells.
* **Active Filter Pills**: All active filters (search, numeric ranges, date ranges, categories) are displayed as interactive badges with 1-click removal.
* **Interactive Column Filters Drawer**: Expandable filter panel with type-specific inputs (date picker, min/max numbers, categorical dropdowns).
* **Clickable Row Detail Inspector**: Click any row to view its full field breakdown with JSON copying and Next/Previous navigation.
* **Column Visibility Manager**: Select which columns are shown or hidden.
* **Table Row Density**: Toggle between `Comfortable` and `Compact` viewing modes.
* **Row Deletion**: Delete rows directly from the table with instant count updates.

### 🛠️ Data Tools & Transform
* **Find & Replace**: Batch replace values or fix typos across any target column.
* **Deduplication**: Scan and remove duplicate rows with 1 click.
* **Insert Record**: Add new records directly to your dataset.
* **Multi-Format Export**: Export filtered data as `.csv`, `.json`, `.tsv`, or copy as a formatted GitHub Markdown table.

### 🌙 Dark / Light Mode
* Sleek theme switcher with system persistence via `localStorage`.

---

## 🛠️ Tech Stack

* **React 19**
* **Vite 8**
* **Papa Parse 5** (High-performance CSV parsing & unparsing)
* **Custom Responsive SVG Visualizations** (Zero heavy chart dependency overhead)
* **Modern CSS3** (Custom properties, dark/light themes, smooth transitions)

---

## 📂 Project Structure

```text
csv-data-filter/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ActiveFilters.jsx       # Active filter badges with 1-click removal
│   │   ├── ChartSection.jsx        # Interactive Bar, Line, Donut, Scatter charts
│   │   ├── ColumnManagerModal.jsx  # Show/hide table columns
│   │   ├── ColumnStats.jsx         # Data health, histograms & profiling
│   │   ├── DataTable.jsx           # Search highlighting, sorting, pagination
│   │   ├── DataTools.jsx           # Find & Replace, deduplicate, new row
│   │   ├── Header.jsx              # Logo, sample selector, dark mode toggle
│   │   ├── RowDetailModal.jsx      # Row inspector with JSON copy & navigation
│   │   ├── SummaryCards.jsx        # Records, filters & columns metrics
│   │   ├── Toast.jsx               # Feedback notifications
│   │   └── UploadZone.jsx          # Drag-drop, browse, raw CSV paste
│   ├── data/
│   │   └── sampleDatasets.js       # Pre-loaded demo datasets
│   ├── utils/
│   │   └── csvHelpers.js           # Type detection, aggregations, stats, exports
│   ├── App.css                     # Modern dashboard styles & dark theme
│   ├── App.jsx                     # Root application coordinator
│   ├── index.css                   # Base typography and design tokens
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Production Build & Deployment

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 📄 License

Available for personal, educational, and portfolio purposes.
