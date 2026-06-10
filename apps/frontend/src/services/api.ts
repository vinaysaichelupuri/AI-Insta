import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Types ──────────────────────────────────────────────────────────────────

export interface IPost {
  _id: string;
  topic: string;
  status: "DRAFT" | "RENDERING" | "PENDING_REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED" | "FAILED";
  createdAt: string;
  publishedAt?: string;
  caption?: string;
  hashtags?: string[];
  failReason?: string; 
}

export interface ISlide {
  _id: string;
  postId: string;
  slideNumber: number;
  title: string;
  content: string;
  templateType: string;
}

// ── Topic ──────────────────────────────────────────────────────────────────

export const submitTopic = async (topic: string, confirmDuplicate: boolean = false) => {
  const response = await api.post('/api/topics', { topic, confirmDuplicate });
  return response.data;
};

// ── Posts ──────────────────────────────────────────────────────────────────

export const getPosts = async (topic?: string, status?: string) => {
  const params = new URLSearchParams();
  if (topic) params.append('topic', topic);
  if (status) params.append('status', status);
  const response = await api.get(`/api/posts?${params.toString()}`);
  return response.data;
};

export const getPost = async (id: string) => {
  const response = await api.get(`/api/posts/${id}`);
  return response.data;
};

export const getSlides = async (postId: string) => {
  const response = await api.get(`/api/posts/${postId}/slides`);
  return response.data;
};

export const updatePostStatus = async (id: string, status: string) => {
  const response = await api.post(`/api/posts/${id}/status`, { status });
  return response.data;
};

export const publishPost = async (id: string) => {
  const response = await api.post(`/api/posts/${id}/publish`);
  return response.data;
};

export const exportPostImages = async (id: string) => {
  const response = await api.post(`/api/posts/${id}/export`);
  return response.data;
};

export const getInstagramConnectionStatus = async () => {
  const response = await api.get('/api/auth/instagram/status');
  return response.data;
};

export const getInstagramConnectUrl = async (redirectUri: string) => {
  const response = await api.get('/api/auth/instagram/connect-url', {
    params: { redirectUri },
  });
  return response.data;
};

export const exchangeInstagramCode = async (code: string, redirectUri: string) => {
  const response = await api.post('/api/auth/instagram/exchange-code', {
    code,
    redirectUri,
  });
  return response.data;
};
