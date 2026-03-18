// src/components/VideoPlayerModal/VideoPlayerModal.jsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

const VideoPlayerModal = ({ videoKey, isOpen, onClose }) => {
  if (!isOpen || !videoKey) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-[100] p-4">
      <div className="bg-brand-bg rounded-lg shadow-xl relative w-full max-w-3xl aspect-video">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-3 md:-top-4 md:-right-3 z-10 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors"
          aria-label="Close video player"
        >
          <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full rounded-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
