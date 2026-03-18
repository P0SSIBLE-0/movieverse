import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { searchMulti } from '../services/tmdbApi';
import { Link } from '@/lib/react-router-dom';
import type { MediaItem, PaginatedResponse, SearchModalProps } from '../types';

type SearchResult = MediaItem & { media_type: 'movie' | 'tv' };

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchMulti(query, 1);
        const filteredResults = (response.data as PaginatedResponse<SearchResult>).results
          .filter(
            (item) =>
              (item.media_type === 'movie' || item.media_type === 'tv') &&
              item.poster_path
          )
          .slice(0, 7);
        setResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-20 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-black/70 -z-40" onClick={onClose}/>
        
        <div 
          ref={modalRef}
          className="inline-block w-full max-w-2xl bg-transparent rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle scrollbar-hide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Search</h3>
              <div className="flex items-center space-x-3">
                <select className="appearance-none bg-zinc-900 text-white text-sm rounded-md px-3 py-2 border border-zinc-800 focus:outline-none">
                  <option>Movie & Shows</option>
                </select>

                <button onClick={onClose} className="text-white bg-zinc-900 px-2 text-sm py-2 rounded-md hover:text-white cursor-pointer">
                  <XMarkIcon className="size-5" />
                </button>
              </div>
            </div>

            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-3 bg-zinc-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-transparent"
                placeholder="Search for movies, TV shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="mt-4 max-h-96 overflow-y-auto scrollbar-hide bg-zinc-900 px-3 py-3 rounded-md space-y-2">
                {Array.from({ length: 4 }).map((_, ind) => (
                  <div className='flex items-center p-3 hover:bg-zinc-800 rounded-lg transition-colors animate-pulse bg-zinc-800 h-22' key={ind}></div>
                ))}
                
              </div>
            ) : results.length > 0 ? (
              <div className="mt-4 max-h-96 overflow-y-auto scrollbar-hide bg-zinc-900">
                {results.map((item) => (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    to={`/${item.media_type === 'movie' ? 'movie' : 'tv'}/${item.id}`}
                    onClick={onClose}
                    className="flex items-center p-3 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 size-18  bg-gray-700 rounded overflow-hidden">
                      {item.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">{item.title || item.name}</h4>
                        
                      </div>
                      <div className="flex items-center mt-1 text-sm text-white">
                        <span className="flex items-center">
                          <svg className="h-3.5 w-3.5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {item.vote_average?.toFixed(1) || 'N/A'}
                        </span>
                        <span className="text-sm mx-3 text-white">
                          {item.media_type === 'movie' ? 'MOVIE' : 'TV'}
                        </span>
                        {item.release_date || item.first_air_date ? (
                          <span className="mr-2">•</span>
                        ) : null}
                        <span>{item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query ? (
              <div className="mt-4 py-8 text-center text-white">
                No results found for "{query}"
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
