// src/components/CastCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CastCard = ({ actor }) => {
  const { getImageUrl } = useAppContext();

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png';
  };

  return (
    <Link to={`/person/${actor.id}`} className="block group">
      <div className="flex flex-col items-center text-center w-full">
        <div className="size-20 md:size-28 rounded-full overflow-hidden mb-2 shadow-lg border-2 border-zinc-800/80 group-hover:border-brand-yellow/60 transition-all duration-300 group-hover:shadow-brand-yellow/20 group-hover:shadow-xl">
          <img
            src={getImageUrl(actor.profile_path, 'w185')}
            alt={actor.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <h4 className="text-sm md:text-base font-semibold text-white truncate w-full group-hover:text-brand-yellow transition-colors duration-300">
          {actor.name}
        </h4>
        <p className="text-xs md:text-sm text-brand-text-secondary truncate w-full">
          {actor.character}
        </p>
      </div>
    </Link>
  );
};

export default CastCard;
