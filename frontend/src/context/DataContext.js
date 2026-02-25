import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [services, setServices] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, teamRes, servicesRes, videosRes] = await Promise.all([
        API.get('/api/projects'),
        API.get('/api/team'),
        API.get('/api/services'),
        API.get('/api/videos')
      ]);

      setProjects(projectsRes.data.data || []);
      setTeam(teamRes.data.data || []);
      setServices(servicesRes.data.data || []);
      setVideos(videosRes.data.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProject = async (formData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/api/projects', formData, config);
      setProjects([res.data.data, ...projects]);
      toast.success('Project added successfully');
      return { success: true, data: res.data.data };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add project');
      return { success: false };
    }
  };

  const updateProject = async (id, formData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/api/projects/${id}`, formData, config);
      setProjects(projects.map(p => p._id === id ? res.data.data : p));
      toast.success('Project updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update project');
      return { success: false };
    }
  };

  const deleteProject = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await API.delete(`/api/projects/${id}`, config);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
      return { success: false };
    }
  };

  const addTeamMember = async (formData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/api/team', formData, config);
      setTeam([...team, res.data.data]);
      toast.success('Team member added successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add team member');
      return { success: false };
    }
  };

  const updateTeamMember = async (id, formData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/api/team/${id}`, formData, config);
      setTeam(team.map(m => m._id === id ? res.data.data : m));
      toast.success('Team member updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update team member');
      return { success: false };
    }
  };

  const deleteTeamMember = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await API.delete(`/api/team/${id}`, config);
      setTeam(team.filter(m => m._id !== id));
      toast.success('Team member deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete team member');
      return { success: false };
    }
  };

  const addService = async (data, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/api/services', data, config);
      setServices([...services, res.data.data]);
      toast.success('Service added successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add service');
      return { success: false };
    }
  };

  const updateService = async (id, data, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/api/services/${id}`, data, config);
      setServices(services.map(s => s._id === id ? res.data.data : s));
      toast.success('Service updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update service');
      return { success: false };
    }
  };

  const deleteService = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await API.delete(`/api/services/${id}`, config);
      setServices(services.filter(s => s._id !== id));
      toast.success('Service deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete service');
      return { success: false };
    }
  };

  const addVideo = async (data, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/api/videos', data, config);
      setVideos([...videos, res.data.data]);
      toast.success('Video added successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add video');
      return { success: false };
    }
  };

  const updateVideo = async (id, data, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/api/videos/${id}`, data, config);
      setVideos(videos.map(v => v._id === id ? res.data.data : v));
      toast.success('Video updated successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update video');
      return { success: false };
    }
  };

  const deleteVideo = async (id, token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await API.delete(`/api/videos/${id}`, config);
      setVideos(videos.filter(v => v._id !== id));
      toast.success('Video deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete video');
      return { success: false };
    }
  };

  return (
    <DataContext.Provider value={{
      projects,
      team,
      services,
      videos,
      loading,
      addProject,
      updateProject,
      deleteProject,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      addService,
      updateService,
      deleteService,
      addVideo,
      updateVideo,
      deleteVideo,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};