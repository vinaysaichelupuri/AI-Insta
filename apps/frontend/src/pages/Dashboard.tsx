import React from "react";
import { TopicSubmissionForm } from "../components/TopicSubmissionForm";
import { useAuth } from "../context/AuthContext";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI-Insta Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Create New Content
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Enter a topic below to generate your Instagram educational carousel.
          </p>
        </div>

        <TopicSubmissionForm />
      </main>
    </div>
  );
};
