import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import CastCard from '../CastCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CastSection = ({ cast }) => {
  return (
    <section className="container mx-auto px-2 md:px-8 lg:px-12 py-6 md:py-7 lg:py-10 ">
      <div className="flex justify-between items-center mt-4 mb-4">
        <h2 className="text-2xl md:text-3xl font-semibold">
          Top Cast
        </h2>
        <div className="items-center gap-2 hidden md:flex lg:flex ">
          <button
            className="cast-prev bg-brand-card rounded-full p-2 hover:bg-brand-card/80 transition-colors"
            aria-label="Previous cast"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            className="cast-next bg-brand-card rounded-full p-2 hover:bg-brand-card/80 transition-colors"
            aria-label="Next cast"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation, FreeMode]}
        navigation={{ prevEl: ".cast-prev", nextEl: ".cast-next" }}
        freeMode={true}
        spaceBetween={10}
        slidesPerView={"auto"}
        className=" px-2 cast-swiper w-full"
      >
        {cast.map((actor) => (
          <SwiperSlide
            key={actor.cast_id || actor.id}
            className="!w-[100px] md:!w-[150px]"
          >
            <CastCard actor={actor} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CastSection;