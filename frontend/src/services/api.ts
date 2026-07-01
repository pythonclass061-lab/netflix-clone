import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const moviesAPI = {
  getTrending: () => api.get('/movies/trending'),
  getPopular: (type = 'movie') => api.get(`/movies/popular?type=${type}`),
  getTopRated: () => api.get('/movies/top-rated'),
  search: (query: string) => api.get(`/movies/search?query=${query}`),
  getDetails: (id: number, type = 'movie') => api.get(`/movies/${id}?type=${type}`),
};

export const paymentAPI = {
  addCard: (data: any) => api.post('/payments/add-card', data),
  getMethods: () => api.get('/payments/methods'),
};

export const watchlistAPI = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (contentId: string) => api.post('/watchlist/add', { contentId }),
  removeFromWatchlist: (contentId: string) => api.delete(`/watchlist/remove/${contentId}`),
};

export default api;
