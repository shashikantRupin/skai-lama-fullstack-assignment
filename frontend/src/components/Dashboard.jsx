import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectModal from './ProjectModal';
import FileUpload from './FileUpload';
import axios from 'axios';
import './Dashboard.css';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectName) => {
    try {
      const response = await axios.post(`${baseURL}/api/projects`, {
        name: projectName,
      });
      setProjects(prev => [response.data, ...prev]);
      setShowProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">Q</div>
            <span>Ques.AI</span>
          </div>
          
          <div className="header-actions">
            <span className="user-name">Welcome, {user?.name}</span>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="section">
            <div className="section-header">
              <h2>Your Projects</h2>
              <button 
                onClick={() => setShowProjectModal(true)}
                className="btn btn-primary"
              >
                + Create New Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3>No projects yet</h3>
                <p>Create your first project to get started with AI transcription</p>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="btn btn-primary"
                >
                  Create New Project
                </button>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map(project => (
                  <div 
                    key={project._id} 
                    className={`project-card ${selectedProject?._id === project._id ? 'selected' : ''}`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="project-header">
                      <h3>{project.name}</h3>
                      <span className="project-status">{project.status}</span>
                    </div>
                    <div className="project-stats">
                      <div className="stat">
                        <span className="stat-number">{project.files?.length || 0}</span>
                        <span className="stat-label">files</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <span className="stat-label">created</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedProject && (
            <div className="section">
              <div className="section-header">
                <h2>Upload Files</h2>
                <p>Add podcast media or transcription text to "{selectedProject.name}"</p>
              </div>
              
              <FileUpload 
                project={selectedProject} 
                onUploadSuccess={fetchProjects}
              />
            </div>
          )}
        </div>
      </main>

      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
};

export default Dashboard;