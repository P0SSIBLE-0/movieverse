import { NavLink, useLocation } from '@/lib/react-router-dom';
import {
  HomeIcon,
  FilmIcon,
  TvIcon,
  MagnifyingGlassIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/explore/movie', label: 'Movies', icon: FilmIcon },
  { path: '/explore/tv', label: 'TV Shows', icon: TvIcon },
  { path: '/search', label: 'Search', icon: MagnifyingGlassIcon },
  { path: '/watchlist', label: 'Watchlist', icon: BookmarkIcon },
];

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-1 left-0 right-0 bg-black/35 mx-auto w-[95%] md:w-[50%] border-t-2 border-zinc-700/70 z-50 lg:hidden backdrop-blur rounded-full">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive: active }) =>
              `flex flex-col items-center justify-center p-2 flex-1 transition-colors ${isActive(item.path)
                ? 'text-yellow-500'
                : 'text-gray-300 hover:text-white'
              }`
            }
          >
            <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'text-yellow-500' : ''}`} />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
