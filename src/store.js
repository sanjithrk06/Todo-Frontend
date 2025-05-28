import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

const useStore = create((set) => ({
  user: null,
  tasks: [],
  isLoading: false,
  error: null,

  // Auth actions
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, tasks: [] });
  },

  // Task actions
  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // API calls
  fetchTasks: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');      const response = await api.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');      const response = await api.post('/tasks', taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        tasks: [response.data, ...state.tasks],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create task', isLoading: false });
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');      const response = await api.put(`/tasks/${taskId}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? response.data : task
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update task', isLoading: false });
    }
  },

  deleteTask: async (taskId) => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem('token');      await api.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete task', isLoading: false });
    }
  },
  // Auth API calls
  handleEmailLogin: async (credentials) => {
    try {      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user });
      return user;
    } catch (error) {
      throw error;
    }
  },

  handleEmailRegister: async (userData) => {
    try {      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user });
      return user;
    } catch (error) {
      throw error;
    }
  },

  handleLogin: async (token) => {
    try {
      localStorage.setItem('token', token);      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data });
    } catch (error) {
      localStorage.removeItem('token');
      set({ error: error.response?.data?.message || 'Failed to authenticate' });
    }
  },
}));

export default useStore;
