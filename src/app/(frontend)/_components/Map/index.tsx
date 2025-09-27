"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const GlobeMap = dynamic(() => import("./GlobeMap"), { ssr: false });
const CountriesList = dynamic(() => import("./CountriesList"), { ssr: false });

const CATEGORIES = [
  { label: "Available", color: "#59FF93" }, // rgb(89, 255, 147)
  { label: "Waitlist", color: "#59FFEE" }, // rgb(89, 255, 238)
  { label: "Coming soon", color: "#3399FF" }, // rgb(51, 153, 255)
  { label: "None", color: "#1F2B37" }, // rgb(31, 43, 55)
];

export default function Map() {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const cRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log(
      aRef?.current?.clientHeight,
      bRef?.current?.clientHeight,
      cRef?.current?.clientHeight,
    );
  }, [
    aRef?.current?.clientHeight,
    bRef?.current?.clientHeight,
    cRef?.current?.clientHeight,
  ]);

  return (
    <div className="page-map relative w-full flex flex-col items-center gap-10 pb-10">
      <div ref={aRef} className="relative w-full">
        <div
          ref={bRef}
          className="p-5 flex flex-wrap gap-3 pointer-events-none"
        >
          {CATEGORIES.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-xs"
                style={{ background: item.color }}
              />
              <div className="text-xs md:text-sm lg:text-base text-white">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <div
          ref={cRef}
          className="globe-map relative w-full max-md:aspect-square md:h-full border-b-1 border-b-white"
        >
          <GlobeMap />
        </div>
      </div>
      <CountriesList />
    </div>
  );
}
