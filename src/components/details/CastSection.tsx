import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import CastCard from '../CastCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CastSection = ({ cast }) => {
  return (
    <section className="relative py-6 md:py-12 overflow-hidden" id="cast-section">
      {/* Subtle top divider line  */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="container mx-auto px-2 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Top Cast
            </h2>
            <p className="text-xs md:text-sm text-white/30 mt-1">
              Meet the stars behind the story
            </p>
          </div>
          <div className="items-center gap-2 hidden md:flex">
            <button
              className="cast-prev p-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Previous cast"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white/50" />
            </button>
            <button
              className="cast-next p-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.06] rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Next cast"
            >
              <ChevronRightIcon className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, FreeMode]}
          navigation={{ prevEl: '.cast-prev', nextEl: '.cast-next' }}
          freeMode={true}
          spaceBetween={12}
          slidesPerView={'auto'}
          className="cast-swiper w-full"
        >
          {cast.map((actor) => (
            <SwiperSlide
              key={actor.cast_id || actor.id}
              className="!w-[100px] md:!w-[120px] lg:!w-[140px]"
            >
              <CastCard actor={actor} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CastSection;
