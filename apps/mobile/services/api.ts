// ──────────────────────────────────────────────────────────────────────────────
// API Service – AI-Insta Mobile
// Mirrors apps/frontend/src/services/api.ts but uses fetch + SecureStore
// ──────────────────────────────────────────────────────────────────────────────

import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Base URL configured via app.json extra.apiUrl, falls back to localhost
const BASE_URL: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ?? 'http://localhost:4000';

export { BASE_URL };

// ── Types ──────────────────────────────────────────────────────────────────

export type PostStatus =
  | 'DRAFT'
  | 'RENDERING'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'FAILED';

export interface IPost {
  _id: string;
  topic: string;
  status: PostStatus;
  createdAt: string;
  publishedAt?: string;
  caption?: string;
  hashtags?: string[];
  failReason?: string;
  slideCount?: number;
}

export interface ISlide {
  _id: string;
  postId: string;
  slideNumber: number;
  title: string;
  content: string;
  templateType: string;
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await SecureStore.getItemAsync('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  // Return null for 204 No Content
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export const getAuthStatus = () =>
  request<{ authenticated: boolean; user?: { email: string; name: string; picture: string } }>(
    '/api/auth/status',
  );

// ── Topics ─────────────────────────────────────────────────────────────────

export const submitTopic = (topic: string, confirmDuplicate = false) =>
  request<{ post: IPost }>('/api/topics', {
    method: 'POST',
    body: JSON.stringify({ topic, confirmDuplicate }),
  });

// ── Posts ──────────────────────────────────────────────────────────────────

export const getPosts = (topic?: string, status?: string) => {
  const params = new URLSearchParams();
  if (topic) params.append('topic', topic);
  if (status) params.append('status', status);
  const qs = params.toString();
  return request<{ posts: IPost[] }>(`/api/posts${qs ? `?${qs}` : ''}`);
};

export const getPost = (id: string) =>
  request<{ post: IPost; slides: ISlide[] }>(`/api/posts/${id}`);

export const getSlides = (postId: string) =>
  request<{ slides: ISlide[] }>(`/api/posts/${postId}/slides`);

export const updatePostStatus = (id: string, status: string) =>
  request<{ post: IPost }>(`/api/posts/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });

export const publishPost = (id: string) =>
  request<{ post: IPost }>(`/api/posts/${id}/publish`, { method: 'POST' });

export const exportPostImages = (id: string) =>
  request<{ message: string }>(`/api/posts/${id}/export`, { method: 'POST' });

// ── Instagram ──────────────────────────────────────────────────────────────

export const getInstagramConnectionStatus = () =>
  request<{ connected: boolean; username?: string }>(
    '/api/auth/instagram/status',
  );

// ── Devices (push notifications) ───────────────────────────────────────────

export const registerDevice = (expoPushToken: string) =>
  request<{ ok: boolean }>('/api/devices/register', {
    method: 'POST',
    body: JSON.stringify({ expoPushToken }),
  });

// ── Slide image URL helper ─────────────────────────────────────────────────

export const getSlideImageUrl = (postId: string, slideNumber: number): string =>
  `${BASE_URL}/assets/generated/${postId}/slide_${slideNumber}.png`;
