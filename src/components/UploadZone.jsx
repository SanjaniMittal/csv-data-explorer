import { useState } from "react";
import { SAMPLE_DATASETS } from "../data/sampleDatasets";

export function UploadZone({ onFileUpload, onRawCsvInput, onLoadSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedText, setPastedText] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedText.trim()) return;
    onRawCsvInput(pastedText, "pasted_data.csv");
    setShowPasteModal(false);
    setPastedText("");
  };

  return (
    <div className="upload-container">
      {/* Drag & Drop Zone */}
      <div
        className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon-pulse">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        <h3>Drag & drop your CSV file here</h3>
        <p className="upload-hint">Supports .csv, .tsv, and comma-separated text files</p>

        <div className="upload-actions-row">
          <label htmlFor="csv-file-input" className="btn-primary browse-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Browse Computer</span>
          </label>
          <input
            id="csv-file-input"
            type="file"
            accept=".csv,.tsv,text/csv"
            onChange={(e) => {
              if (e.target.files?.[0]) onFileUpload(e.target.files[0]);
            }}
            style={{ display: "none" }}
          />

          <button
            className="btn-secondary"
            onClick={() => setShowPasteModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            <span>Paste Raw CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Sample Dataset Cards */}
      <div className="samples-section">
        <div className="samples-header">
          <span className="samples-title">Or explore instantly with pre-loaded demo datasets:</span>
        </div>
        <div className="sample-cards-grid">
          {SAMPLE_DATASETS.map((ds) => (
            <div
              key={ds.id}
              className="sample-card"
              onClick={() => onLoadSample(ds.id)}
              role="button"
              tabIndex={0}
            >
              <div className="sample-card-top">
                <span className="sample-badge">{ds.badge}</span>
                <span className="sample-arrow">→</span>
              </div>
              <h4 className="sample-card-title">{ds.title}</h4>
              <p className="sample-card-desc">{ds.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paste Raw CSV Modal */}
      {showPasteModal && (
        <div className="modal-backdrop" onClick={() => setShowPasteModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Paste CSV Data</h3>
              <button className="close-btn" onClick={() => setShowPasteModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-instruction">
                Paste your CSV content directly with headers on the first line:
              </p>
              <textarea
                className="paste-textarea"
                rows={8}
                placeholder="Product,Category,Price,Quantity&#10;Laptop,Tech,1200,5&#10;Mouse,Tech,25,40"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPasteModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handlePasteSubmit} disabled={!pastedText.trim()}>
                Parse & Load Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
