import React, { useState, useEffect, useRef } from "react";
import { TopicSubmissionForm } from "../components/TopicSubmissionForm";
import { PreviewCarousel } from "../components/PreviewCarousel";
import { useAuth } from "../context/AuthContext";
import { getPost, getSlides, IPost, ISlide } from "../services/api";

const POLLING_STATUSES = new Set(["DRAFT", "RENDERING"]);

export const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  // After submission we track the new post ID
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const [generatingPost, setGeneratingPost] = useState<IPost | null>(null);
  const [slides, setSlides] = useState<ISlide[]>([]);
  const [pollError, setPollError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Called by TopicSubmissionForm when topic is successfully submitted
  const handleTopicSubmitted = (postId: string) => {
    setPendingPostId(postId);
    setGeneratingPost(null);
    setSlides([]);
    setPollError(null);
  };

  // Poll backend every 4 seconds while status is DRAFT or RENDERING
  useEffect(() => {
    if (!pendingPostId) return;

    const poll = async () => {
      try {
        const data = await getPost(pendingPostId);
        const post: IPost = data.post;
        setGeneratingPost(post);

        if (!POLLING_STATUSES.has(post.status)) {
          // Generation done — stop polling
          if (pollRef.current) clearInterval(pollRef.current);

          if (post.status === "PENDING_REVIEW") {
            // Fetch slides so the carousel can be shown
            const slideData = await getSlides(pendingPostId);
            setSlides(slideData.slides || []);
          }
        }
      } catch (err) {
        console.error("Poll error", err);
        setPollError("Lost connection to server. Please refresh.");
        if (pollRef.current) clearInterval(pollRef.current);
      }
    };

    // Run immediately, then every 4s
    poll();
    pollRef.current = setInterval(poll, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pendingPostId]);

  const handleStatusUpdate = (updatedPost: IPost) => {
    setGeneratingPost(updatedPost);
  };

  const handleNewPost = () => {
    setPendingPostId(null);
    setGeneratingPost(null);
    setSlides([]);
    setPollError(null);
  };

  const isGenerating = generatingPost && POLLING_STATUSES.has(generatingPost.status);
  const isPendingReview = generatingPost?.status === "PENDING_REVIEW";
  const isFailed = generatingPost?.status === "FAILED";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI-Insta Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, Creator</span>
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

        {/* ── Topic Submission ─────────────────────────────────────────── */}
        {!generatingPost && (
          <>
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                Create New Content
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Enter a topic below to generate your Instagram educational carousel.
              </p>
            </div>
            <TopicSubmissionForm onSubmitted={handleTopicSubmitted} />
          </>
        )}

        {/* ── Generating in Progress ───────────────────────────────────── */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Generating Carousel
              </h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Creating content for: <strong>{generatingPost!.topic}</strong>
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Status: <span className="text-yellow-500 font-medium">{generatingPost!.status}</span>
                &nbsp;— This usually takes 20–40 seconds…
              </p>
            </div>
            <button
              onClick={handleNewPost}
              className="text-sm text-gray-400 underline hover:text-gray-600"
            >
              Cancel and start over
            </button>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────── */}
        {(isFailed || pollError) && (
          <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-700 font-semibold mb-1">
              {isFailed ? "Content generation failed." : pollError}
            </p>
            <p className="text-sm text-red-500 mb-4">
              {isFailed ? "The AI pipeline encountered an error. Please try again." : ""}
            </p>
            <button
              onClick={handleNewPost}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Preview / Review ─────────────────────────────────────────── */}
        {isPendingReview && generatingPost && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Your Carousel</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Your content is ready! Review the slides below then approve or reject.
              </p>
            </div>

            {slides.length === 0 ? (
              <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                <p className="text-yellow-700">
                  Content generated but no slides were found. The render pipeline may still be processing.
                </p>
                <button
                  onClick={async () => {
                    try {
                      const slideData = await getSlides(generatingPost._id);
                      setSlides(slideData.slides || []);
                    } catch {/* ignore */}
                  }}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                >
                  Refresh Slides
                </button>
              </div>
            ) : (
              <PreviewCarousel
                post={generatingPost}
                slides={slides}
                onStatusUpdate={handleStatusUpdate}
              />
            )}

            <div className="text-center">
              <button
                onClick={handleNewPost}
                className="text-sm text-blue-500 underline hover:text-blue-700"
              >
                Create Another Post
              </button>
            </div>
          </div>
        )}

        {/* ── After Approval / Publication ─────────────────────────────── */}
        {generatingPost && (generatingPost.status === "APPROVED" || generatingPost.status === "PUBLISHED") && (
          <div className="space-y-6">
            <PreviewCarousel
              post={generatingPost}
              slides={slides}
              onStatusUpdate={handleStatusUpdate}
            />
            <div className="text-center">
              <button
                onClick={handleNewPost}
                className="text-sm text-blue-500 underline hover:text-blue-700"
              >
                Create Another Post
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
