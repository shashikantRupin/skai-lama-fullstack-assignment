import { useState } from "react";
import "./PodcastUpload.css";

function PodcastUpload() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");

  const handleSectionClick = (sectionType) => {
    setSelectedSection(sectionType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSection("");
  };

  const handleUpload = () => {
    // Handle upload logic here
    console.log("Upload clicked for:", selectedSection);
    closeModal();
  };

  return (
    <div className="podcast-upload-container">
      <div className="breadcrumb">
        <span>🏠 Home Page / Sample Project / </span>
        <span className="current-page">Add your podcast</span>
      </div>

      <h1 className="page-title">Add Podcast</h1>

      <div className="upload-sections">
        <div
          className="upload-section"
          onClick={() => handleSectionClick("RSS Feed")}
        >
          <div className="icon-container rss-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248s-3.249-1.454-3.249-3.248c0-1.794 1.454-3.249 3.249-3.249s3.251 1.455 3.251 3.249zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.978c-.059-8.794-7.154-15.878-16-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
            </svg>
          </div>
          <h3>RSS Feed</h3>
          <p>
            Lorem ipsum dolor sit.
            <br />
            Dolor lorem sit.
          </p>
        </div>

        <div
          className="upload-section"
          onClick={() => handleSectionClick("Youtube Video")}
        >
          <div className="icon-container youtube-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <h3>Youtube Video</h3>
          <p>
            Lorem ipsum dolor sit.
            <br />
            Dolor lorem sit.
          </p>
        </div>

        <div
          className="upload-section"
          onClick={() => handleSectionClick("Upload Files")}
        >
          <div className="icon-container upload-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              <path d="M12,11L16,15H13V19H11V15H8L12,11Z" />
            </svg>
          </div>
          <h3>Upload Files</h3>
          <p>
            Lorem ipsum dolor sit.
            <br />
            Dolor lorem sit.
          </p>
        </div>
      </div>

      

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {selectedSection === "Youtube Video" && (
                  <>
                    <div className="modal-icon youtube-icon">
                      <svg
                        width="24\"
                        height="24\"
                        viewBox="0 0 24 24\"
                        fill="white"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    Upload from Youtube
                  </>
                )}
                {selectedSection === "RSS Feed" && (
                  <>
                    <div className="modal-icon rss-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248s-3.249-1.454-3.249-3.248c0-1.794 1.454-3.249 3.249-3.249s3.251 1.455 3.251 3.249zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.978c-.059-8.794-7.154-15.878-16-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z" />
                      </svg>
                    </div>
                    Upload from RSS Feed
                  </>
                )}
                {selectedSection === "Upload Files" && (
                  <>
                    <div className="modal-icon upload-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        <path d="M12,11L16,15H13V19H11V15H8L12,11Z" />
                      </svg>
                    </div>
                    Upload Files
                  </>
                )}
              </div>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" className="form-input" />
              </div>

              <div className="form-group">
                <label htmlFor="transcript">Transcript</label>
                <textarea
                  id="transcript"
                  className="form-textarea"
                  rows="4"
                ></textarea>
              </div>

              <button className="upload-btn" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PodcastUpload;
