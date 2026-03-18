import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';

import MovieCard from './MovieCard';
import useFetch from '../hooks/useFetch';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { ContentRowProps, MediaItem, PaginatedResponse } from '../types';

const ContentRow = ({ title, fetchFunction, apiParams = [], mediaType }: ContentRowProps) => {
  const { loadingConfig } = useAppContext();
  const { data, loading, error } = useFetch<PaginatedResponse<MediaItem>, unknown[]>(
    fetchFunction,
    ...apiParams
  );
  const swiperRef = useRef<SwiperInstance | null>(null);
  if (loadingConfig || loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-brand-yellow">
          {title}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-brand-card rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <p>
          Error loading {title}: {error}
        </p>
      </div>
    );
  }

  const items = data?.results || [];
  if (!items.length) return null;

  return (
    <div className="mb-8 md:mb-12 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">
          {title}
        </h2>
        <div className="flex items-center space-x-2 hidden md:flex lg:flex">
          <button className="bg-brand-card bg-opacity-60 hover:bg-black/20 rounded-full text-white text-base md:text-lg p-2 cursor-pointer disabled:opacity-20" onClick={() => swiperRef.current?.slidePrev()} disabled={swiperRef.current?.isBeginning}>
            <ChevronLeftIcon className="size-6" />
          </button>
          <button className="bg-brand-card bg-opacity-60 hover:bg-black/20 rounded-full text-white text-base md:text-lg p-2 cursor-pointer disabled:opacity-20" onClick={() => swiperRef.current?.slideNext()} disabled={swiperRef.current?.isEnd}>
            <ChevronRightIcon className="size-6" />
          </button>
        </div>
      </div>

      {/* Custom Navigation Buttons */}
      {/* <div className="custom-swiper-button-prev absolute top-1/2 -left-2 transform -translate-y-1/2 z-10 cursor-pointer p-1 bg-brand-card bg-opacity-60 hover:bg-opacity-80 rounded-full text-white text-base md:text-lg  mt-5 p-2">
        <ChevronLeftIcon className="size-6" />
      </div>
      <div className="custom-swiper-button-next absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 cursor-pointer p-1 bg-brand-card bg-opacity-60 hover:bg-opacity-80 rounded-full text-white text-base md:text-lg mt-5 p-2">
        <ChevronRightIcon className="size-6 " />
      </div> */}

      <Swiper
        modules={[Navigation]}
        navigation={false}
        spaceBetween={16}
        slidesPerView={'auto'}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="px-4 py-3"
      >
        {items.map((item) => (
          <SwiperSlide
            key={item.id}
            className="!w-[150px] sm:!w-[160px] md:!w-[180px]"
          >
            <MovieCard item={item} mediaType={mediaType || item.media_type} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentRow;
