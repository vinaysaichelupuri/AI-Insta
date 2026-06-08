import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { HistoryDashboard } from "./pages/HistoryDashboard";
import { Login } from "./pages/Login";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <nav className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">AI-Insta</h1>
            <div className="flex gap-4">
              <Link to="/" className="text-blue-500 hover:text-blue-700">Create</Link>
              <Link to="/history" className="text-blue-500 hover:text-blue-700">History</Link>
              <Link to="/login" className="text-gray-500 hover:text-gray-700">Login</Link>
            </div>
          </nav>
          
          <main className="p-4 sm:p-6 max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/history" element={<HistoryDashboard />} />
              <Route path="/login" element={<Login />} />
              {/* Optional: Add a route for previewing specific posts if needed, or render PreviewCarousel inline in Dashboard */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
