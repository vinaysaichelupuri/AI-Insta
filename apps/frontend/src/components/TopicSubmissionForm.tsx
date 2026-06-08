import React, { useState } from "react";
import { submitTopic } from "../services/api";

interface TopicSubmissionFormProps {
  /** Called with the new post's ID once submission succeeds */
  onSubmitted?: (postId: string) => void;
}

export const TopicSubmissionForm: React.FC<TopicSubmissionFormProps> = ({ onSubmitted }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const validate = () => {
    if (!topic.trim()) {
      setError("Topic is required.");
      return false;
    }
    if (topic.length > 200) {
      setError("Topic must be under 200 characters.");
      return false;
    }
    return true;
  };

  const handleSubmission = async (confirmDuplicate = false) => {
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setDuplicateWarning(null);

    try {
      const result = await submitTopic(topic, confirmDuplicate);
      setTopic("");
      // Propagate the new post ID to the parent (Dashboard) so it can poll
      if (onSubmitted && result.id) {
        onSubmitted(result.id);
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setDuplicateWarning(err.response.data.message || "Duplicate topic found. Proceed?");
      } else {
        setError(err.response?.data?.message || "An error occurred while submitting the topic.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmission(false);
  };

  const handleConfirmDuplicate = () => {
    handleSubmission(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Submit New Topic</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Educational Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Black Holes, Photosynthesis"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !!duplicateWarning}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Generate Content"}
        </button>
      </form>

      {duplicateWarning && (
        <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
          <p className="text-sm text-yellow-800 mb-3">{duplicateWarning}</p>
          <div className="flex space-x-3">
            <button
              onClick={handleConfirmDuplicate}
              className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 focus:outline-none"
            >
              Proceed Anyway
            </button>
            <button
              onClick={() => setDuplicateWarning(null)}
              className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
