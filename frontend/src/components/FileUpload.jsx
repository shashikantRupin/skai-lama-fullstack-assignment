import { useState, useRef } from 'react';
import axios from 'axios';
import './FileUpload.css';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const FileUpload = ({ project, onUploadSuccess }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
      'video/mp4', 'video/mpeg', 'video/quicktime',
      'text/plain', 'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid audio, video, or text file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      await axios.post(
        `${baseURL}/api/projects/${project._id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      onUploadSuccess();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleView = async (fileId) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/projects/${project._id}/files/${fileId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const file = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("Error viewing file:", error);
      alert("Unable to view file");
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(
        `${baseURL}/api/projects/${project._id}/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("File deleted successfully");
      onUploadSuccess(); // refresh file list
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Unable to delete file");
    }
  };
  

  return (
    <div className="file-upload-section">
      <div
        className={`upload-area ${isDragOver ? "dragover" : ""} ${
          uploading ? "uploading" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="audio/*,video/*,text/*,.pdf"
          style={{ display: "none" }}
          disabled={uploading}
        />

        {uploading ? (
          <div className="upload-progress">
            <div className="progress-circle">
              <svg className="progress-ring\" width="60\" height="60">
                <circle
                  className="progress-ring-circle"
                  stroke="#8b5cf6"
                  strokeWidth="4"
                  fill="transparent"
                  r="26"
                  cx="30"
                  cy="30"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 26}`,
                    strokeDashoffset: `${
                      2 * Math.PI * 26 * (1 - uploadProgress / 100)
                    }`,
                  }}
                />
              </svg>
              <div className="progress-text">{uploadProgress}%</div>
            </div>
            <p className="upload-status">Uploading file...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h3>Select a file or drag and drop here</h3>
            <p>Podcast Media or Transcription Text</p>
            <p className="file-types">
              MP3, WAV, MP4, TXT, PDF files up to 100MB
            </p>
            <button type="button" className="btn btn-primary upload-btn">
              Select File
            </button>
          </div>
        )}
      </div>

      {project.files.map((file, index) => (
        <div key={index} className="file-item">
          <div className="file-icon">📄</div>
          <div className="file-info">
            <div>
              <div className="file-name">{file.originalName}</div>
              <div className="file-date">
                {new Date(file.uploadDate).toLocaleDateString()}
              </div>
            </div>
            <div className="file-actions">
              <button
                className="btn-action btn-sm view-btn"
                onClick={() => handleView(file._id)}
              >
                View
              </button>
              <button
                className="btn-action btn-sm delete-btn"
                onClick={() => handleDelete(file._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
};

export default FileUpload;