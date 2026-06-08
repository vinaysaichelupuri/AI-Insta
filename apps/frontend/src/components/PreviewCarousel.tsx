import React, { useState } from 'react';
import { IPost, ISlide, updatePostStatus, publishPost } from '../services/api';

interface PreviewCarouselProps {
  post: IPost;
  slides: ISlide[];
  onStatusUpdate: (post: IPost) => void;
}

export const PreviewCarousel: React.FC<PreviewCarouselProps> = ({ post, slides, onStatusUpdate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleAction = async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updatePostStatus(post._id, status);
      onStatusUpdate(response.post);
    } catch (err) {
      setError('Failed to update status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publishPost(post._id);
      onStatusUpdate(response.post);
    } catch (err) {
      setError('Failed to publish post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!slides || slides.length === 0) {
    return <div>No slides to preview.</div>;
  }

  const slide = slides[currentSlide];

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const imageUrl = `${baseUrl}/assets/generated/${post._id}/slide_${slide.slideNumber}.png`;

  return (
    <div className="preview-carousel p-4 border rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Preview: {post.topic}</h2>
      
      <div className="relative h-[450px] bg-gray-100 flex items-center justify-center p-0 text-center overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`Slide ${slide.slideNumber}`} 
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1080x1350?text=Image+Not+Found';
          }}
        />
        
        <button 
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
          onClick={handlePrev}
        >
          &lt;
        </button>
        <button 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
          onClick={handleNext}
        >
          &gt;
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Slide {currentSlide + 1} of {slides.length}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
        <h4 className="font-semibold mb-1">Caption:</h4>
        <p>{post.caption}</p>
        <p className="text-blue-500 mt-2">{post.hashtags?.join(' ')}</p>
      </div>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

      <div className="mt-6 flex justify-between">
        {post.status !== 'PUBLISHED' && post.status !== 'APPROVED' && (
          <>
            <button 
              onClick={() => handleAction('REJECTED')}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Reject
            </button>
            <button 
              onClick={() => handleAction('RENDERING')}
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              Regenerate
            </button>
            <button 
              onClick={() => handleAction('APPROVED')}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Approve
            </button>
          </>
        )}
        {post.status === 'APPROVED' && (
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Publish to Instagram
          </button>
        )}
        {post.status === 'PUBLISHED' && (
          <div className="w-full text-center text-green-600 font-bold">
            Successfully Published!
          </div>
        )}
      </div>
    </div>
  );
};
