import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { HistoryDashboard } from "./pages/HistoryDashboard";
import { Login } from "./pages/Login";
import "./App.css";

const Nav: React.FC = () => {
  const { token, logout } = useAuth();
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">AI-Insta</h1>
      <div className="flex gap-4 items-center">
        {token ? (
          <>
            <Link to="/" className="text-blue-500 hover:text-blue-700 text-sm font-medium">Create</Link>
            <Link to="/history" className="text-blue-500 hover:text-blue-700 text-sm font-medium">History</Link>
            <button
              onClick={logout}
              className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Nav />
          <main className="p-4 sm:p-6 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<HistoryDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
