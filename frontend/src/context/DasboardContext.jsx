import axios from 'axios';
import React, { createContext, useState } from 'react'

export const  DasboardContext=createContext();

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DashboardContextProvider=({children})=>{
       const [projects, setProjects] = useState([]);
       const [selectedProject, setSelectedProject] = useState(null);
       const [loading, setLoading] = useState(true);

      
       const fetchProjects = async () => {
         try {
           const response = await axios.get(`${baseURL}/api/projects`);
           setProjects(response.data);

           // Update selectedProject with the latest data from the updated list
           if (selectedProject) {
             const updated = response.data.find(
               (proj) => proj._id === selectedProject._id
             );
             if (updated) setSelectedProject(updated);
           }
         } catch (error) {
           console.error("Error fetching projects:", error);
         } finally {
           setLoading(false);
         }
       }; 
      return (
        <DasboardContext.Provider
          value={
            {projects,
            setProjects,
            loading,
            fetchProjects,
            selectedProject,
            setSelectedProject
            }
          }
        >
          {children}
        </DasboardContext.Provider>
      );
}
 export default DashboardContextProvider;
