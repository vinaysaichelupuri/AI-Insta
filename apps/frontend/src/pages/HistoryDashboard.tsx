import React, { useState, useEffect } from 'react';
import { IPost, getPosts } from '../services/api';

export const HistoryDashboard: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts(topicFilter);
      setPosts(data.posts || []);
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  return (
    <div className="history-dashboard max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Content History</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input 
          type="text" 
          placeholder="Filter by topic..." 
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <div key={post._id} className="border rounded p-4 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-lg mb-2">{post.topic}</h3>
              <div className="text-sm text-gray-600 mb-2">
                <span className={`inline-block px-2 py-1 rounded text-xs text-white ${
                  post.status === 'PUBLISHED' ? 'bg-green-500' :
                  post.status === 'APPROVED' ? 'bg-blue-500' :
                  post.status === 'REJECTED' || post.status === 'FAILED' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}>
                  {post.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                Created: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {post.publishedAt && (
                <p className="text-sm text-gray-500">
                  Published: {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
