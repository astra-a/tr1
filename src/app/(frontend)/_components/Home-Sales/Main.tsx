"use client";

import First from "./First";
import Second from "./Second";
import Third from "./Third";
import Fourth from "./Fourth";
import Fifth from "./Fifth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";

export default function Main() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden antialiased">
      <div className="w-full min-h-full hidden md:block">
        <Swiper
          modules={[Mousewheel, Pagination]}
          direction="vertical"
          slidesPerView={1}
          speed={700}
          allowTouchMove={false}
          pagination={{ clickable: true }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 1,
            thresholdTime: 500,
            thresholdDelta: 50,
          }}
          style={{ height: "100vh" }}
        >
          <SwiperSlide>
            <First />
          </SwiperSlide>
          <SwiperSlide className="swiper-slide-line-ray">
            <Second />
          </SwiperSlide>
          <SwiperSlide className="swiper-slide-line-ray">
            <Third />
          </SwiperSlide>
          <SwiperSlide className="swiper-slide-line-ray">
            <Fourth />
          </SwiperSlide>
          <SwiperSlide className="swiper-slide-line-ray">
            <Fifth />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="w-full min-h-full md:hidden">
        <First />
        <div className="w-full h-0.25 line-ray" />
        <Second />
        <div className="w-full h-0.25 line-ray" />
        <Third />
        <div className="w-full h-0.25 line-ray" />
        <Fourth />
        <div className="w-full h-0.25 line-ray" />
        <Fifth />
      </div>
    </div>
  );
}
