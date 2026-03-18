import React from 'react';
import { Link, useLocation } from '@/lib/react-router-dom';
import { XMarkIcon, HomeIcon, FilmIcon, TvIcon, SparklesIcon, MagnifyingGlassIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const section_1 = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Search', path: '/search', icon: MagnifyingGlassIcon },
  ];
  const section_2 = [
    { name: 'Movies', path: '/explore/movie', icon: FilmIcon },
    { name: 'TV Shows', path: '/explore/tv', icon: TvIcon },
    { name: 'Anime', path: '/explore/anime', icon: SparklesIcon },
    { name: 'Watchlist', path: '/watchlist', icon: BookmarkIcon },
  ];
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 lg:w-72 bg-black z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col `}
      >
        <nav className="flex flex-col min-h-full overflow-y-auto">
          <ul className="space-y-2 rounded-lg bg-zinc-900 m-2 py-4">
            {section_1.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? ' text-yellow-500'
                      : 'text-gray-300 hover:bg-zinc-800'
                  }`}
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 flex-1 px-2 py-4 mt-auto rounded-lg bg-zinc-900 m-2">
            {section_2.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${ 
                    location.pathname === item.path
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:bg-zinc-800'
                  }`}
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
