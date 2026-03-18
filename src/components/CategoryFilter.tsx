// src/components/CategoryFilter/CategoryFilter.jsx
import React, {  useRef } from 'react';
import { Link } from '@/lib/react-router-dom';

const categories = [
  { name: 'All', value: 'all', url:'/explore/movie' },
  { name: 'Movies', value: 'movie', url:'/explore/movie' },
  { name: 'TV Shows', value: 'tv', url:'/explore/tv' },
  { name: 'Anime', value: 'anime', url:'/explore/anime' }, // 'anime' might need special handling / genre filtering
  // Add more categories if needed
  // { name: 'Trending', value: 'trending' },
  // { name: 'New Releases', value: 'new' },
];

const CategoryFilter = ({ onCategoryChange, activeCategory }) => {
  const scrollContainerRef = useRef(null);

  // Not implementing actual filter change yet, just UI
  const handleSelectCategory = (categoryValue) => {
    console.log('Selected category:', categoryValue);
    // onCategoryChange(categoryValue); // You'll call this later
  };

  return (
    <div className="py-3 px-2 md:px-4 mb-4 relative">
      <div
        ref={scrollContainerRef}
        className="flex items-center space-x-2 overflow-auto scrollbar-hide"
      >
        {categories.map((category) => (
          <Link
            key={category.value}
            to={category.url}
            onClick={() => handleSelectCategory(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer inline-flex justify-center items-center
              ${
                activeCategory === category.value
                  ? 'bg-brand-active-tab text-brand-text-dark'
                  : 'bg-brand-inactive-tab text-brand-text-primary hover:bg-opacity-80'
              }
              ${category.value === 'all' ? 'min-w-[60px]' : 'min-w-[100px]'}
            `}
          >
            {category.name}
          </Link>
        ))}
      </div>
      {/* Optional: Right fade/arrow if scrollable */}
      <div className="absolute top-0 right-0 bottom-0 flex items-center pr-2 bg-gradient-to-l from-brand-bg via-brand-bg/80 to-transparent pointer-events-none w-12">
        {/* The arrow in UI is likely a visual hint for scrollability, not a button */}
        {/* <ChevronRightIcon className="h-6 w-6 text-white" /> */}
      </div>
    </div>
  );
};

export default CategoryFilter;
