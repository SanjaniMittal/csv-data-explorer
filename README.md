# CSV Data Explorer

A modern React-based web application that allows users to upload CSV files and explore their data directly in the browser.

The application provides powerful search, filtering, sorting, pagination, and CSV export functionality without requiring a backend or database.

## 🚀 Live Demo

## 🚀 Live Demo

[View Live Demo](https://sanjanimittal.github.io/csv-data-explorer/)

## 📌 Features

* 📁 **CSV File Upload** — Upload `.csv` files directly from your computer
* 🔍 **Global Search** — Search across all columns simultaneously
* 🎯 **Column Filters** — Filter data using individual column values
* 🔢 **Numeric Filtering** — Set minimum and maximum values for numeric columns
* ↕️ **Sorting** — Sort columns in ascending or descending order
* 📊 **Data Summary** — View total records, filtered records, and number of columns
* 📄 **Pagination** — Navigate large datasets page by page
* 🔢 **Rows per Page** — Choose between 10, 25, 50, or 100 rows
* 🧹 **Clear Filters** — Quickly reset search and filter conditions
* 📥 **CSV Export** — Download filtered results as a new CSV file
* 🗑️ **Remove File** — Remove the currently loaded dataset
* ⚠️ **Error Handling** — Handles invalid or empty CSV files
* ⏳ **Loading State** — Displays processing feedback while importing data
* 📱 **Responsive Design** — Works across desktop and smaller screens

## 🛠️ Tech Stack

* **React**
* **Vite**
* **JavaScript**
* **Papa Parse**
* **CSS**
* **ESLint**

## 📂 Project Structure

```text
csv-data-filter/
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SanjaniMittal/csv-data-explorer.git
```

### 2. Navigate to the project

```bash
cd csv-data-explorer
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 📊 How to Use

1. Open the application in your browser.
2. Click **Choose CSV File**.
3. Upload a valid `.csv` file.
4. Explore the uploaded dataset in the table.
5. Use the search box to search across all columns.
6. Apply individual column filters.
7. Use Min/Max fields for numeric columns.
8. Click a column heading to sort the data.
9. Navigate through pages using pagination.
10. Click **Export Filtered Data** to download the filtered dataset.

## 🧪 Example Dataset

The application can be tested with datasets containing information such as:

* Brand
* City
* Region
* Store format
* Stock status
* Promotion status
* Percentage-based metrics

For example:

```text
brand,city,region,store_format,in_stock,on_promotion,share_of_shelf_pct
Brand A,Delhi,North,Supermarket,Yes,No,24.5
Brand B,Mumbai,West,Hypermarket,Yes,Yes,31.2
Brand C,Bengaluru,South,Supermarket,No,No,18.7
```

## 🔍 Filtering Example

The application supports both categorical and numeric filtering.

### Categorical filtering

For columns such as:

```text
Brand
City
Region
Store Format
```

users can select a specific value from the dropdown.

### Numeric filtering

For numeric columns, users can specify:

```text
Min → 20
Max → 50
```

The table will display only records within that range.

## 📥 Export

After applying search and filters, click:

**Export Filtered Data**

The application generates a new CSV file containing only the currently filtered records.

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📈 Future Improvements

Potential future enhancements include:

* 📊 Interactive charts and visualizations
* 📈 Dataset statistics and analytics
* 🌙 Dark mode
* 💾 Local storage for uploaded datasets
* 🔎 Advanced multi-condition filtering
* 📤 Drag-and-drop CSV upload
* 📱 Improved mobile table experience
* 📊 Automatic data-type detection
* 📥 Export to additional formats

## 👩‍💻 Author

**Sanjani Mittal**

GitHub: [SanjaniMittal](https://github.com/SanjaniMittal)

## 📄 License

This project is available for educational and portfolio purposes.

