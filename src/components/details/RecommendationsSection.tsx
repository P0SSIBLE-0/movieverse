import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import MovieCard from '../MovieCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const RecommendationsSection = ({ items, mediaType, title }) => {
  return (
    <section className="relative py-8 md:py-12 overflow-hidden" id="recommendations-section">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="container mx-auto px-2 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs md:text-sm text-white/30 mt-1">
              Because you might enjoy these too
            </p>
          </div>
          <div className="items-center gap-2 hidden md:flex">
            <button
              className="recommendations-prev p-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Previous recommendations"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white/50" />
            </button>
            <button
              className="recommendations-next p-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Next recommendations"
            >
              <ChevronRightIcon className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation={{
            prevEl: '.recommendations-prev',
            nextEl: '.recommendations-next',
          }}
          freeMode={true}
          spaceBetween={16}
          slidesPerView={'auto'}
          className="recommendations-swiper"
        >
          {items.map((item) => (
            <SwiperSlide
              key={item.id}
              className="!w-[140px] sm:!w-[155px] md:!w-[175px]"
            >
              <MovieCard
                item={item}
                mediaType={item.media_type || mediaType}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RecommendationsSection;
