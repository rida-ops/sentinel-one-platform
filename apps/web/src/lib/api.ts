import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', response.data.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function login(email: string, password: string) {
  return apiClient.post('/auth/login', { email, password });
}

export async function getIncidents() {
  return apiClient.get('/incidents');
}

export async function createIncident(data: any) {
  return apiClient.post('/incidents', data);
}

export async function updateIncidentState(id: string, data: any) {
  return apiClient.patch(`/incidents/${id}/state`, data);
}

export async function listUsers() {
  return apiClient.get('/users');
}

export async function listTasks() {
  return apiClient.get('/tasks');
}

export async function assignTask(id: string, data: any) {
  return apiClient.patch(`/tasks/${id}/assign`, data);
}

export default apiClient;
