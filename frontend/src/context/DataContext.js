import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [services, setServices] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsRes, teamRes, servicesRes, videosRes] = await Promise.all([
        API.get('/projects'),
        API.get('/team'),
        API.get('/services'),
        API.get('/videos')
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProject = async (projectData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/projects', projectData, config);
      setProjects([res.data.data, ...projects]);
      toast.success('Project added successfully');
      return { success: true, data: res.data.data };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add project');
      return { success: false };
    }
  };

  const updateProject = async (id, projectData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/projects/${id}`, projectData, config);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/projects/${id}`, config);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
      return { success: false };
    }
  };

  const addTeamMember = async (memberData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/team', memberData, config);
      setTeam([...team, res.data.data]);
      toast.success('Team member added successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add team member');
      return { success: false };
    }
  };

  const updateTeamMember = async (id, memberData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/team/${id}`, memberData, config);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/team/${id}`, config);
      setTeam(team.filter(m => m._id !== id));
      toast.success('Team member deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete team member');
      return { success: false };
    }
  };

  const addService = async (serviceData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/services', serviceData, config);
      setServices([...services, res.data.data]);
      toast.success('Service added successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add service');
      return { success: false };
    }
  };

  const updateService = async (id, serviceData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/services/${id}`, serviceData, config);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/services/${id}`, config);
      setServices(services.filter(s => s._id !== id));
      toast.success('Service deleted successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete service');
      return { success: false };
    }
  };

  const addVideo = async (videoData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.post('/videos', videoData, config);
      setVideos([...videos, res.data.data]);
      toast.success('Video added successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add video');
      return { success: false };
    }
  };

  const updateVideo = async (id, videoData, token) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      const res = await API.put(`/videos/${id}`, videoData, config);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/videos/${id}`, config);
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