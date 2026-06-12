import { useState, useCallback } from 'react';
import { getPosts, IPost, PostStatus } from '../services/api';

export function usePosts(defaultStatus?: PostStatus) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(
    async (status?: PostStatus) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getPosts(undefined, status ?? defaultStatus);
        setPosts(res.posts ?? []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    },
    [defaultStatus],
  );

  const updatePost = useCallback((updated: IPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p)),
    );
  }, []);

  return { posts, isLoading, error, fetchPosts, updatePost, setPosts };
}
