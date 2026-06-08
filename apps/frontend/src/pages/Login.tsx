import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.token);
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Creator Login</h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};
