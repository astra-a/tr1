"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Countries } from "../../_mocks/map";

const GlobeMap = dynamic(() => import("./GlobeMap"), { ssr: false });

function CountriesList() {
  const [availableArr, waitlistArr, comingSoonArr, maxArr] = useMemo(() => {
    const _availableArr: string[] = [];
    const _waitlistArr: string[] = [];
    const _comingSoonArr: string[] = [];
    Countries.features.forEach((feature) => {
      switch (feature.properties.STATE) {
        case "available":
          _availableArr.push(feature.properties.ADMIN);
          break;
        case "waitlist":
          _waitlistArr.push(feature.properties.ADMIN);
          break;
        case "coming soon":
          _comingSoonArr.push(feature.properties.ADMIN);
          break;
      }
    });
    return [
      _availableArr,
      _waitlistArr,
      _comingSoonArr,
      new Array(
        Math.max(
          _availableArr.length,
          _waitlistArr.length,
          _comingSoonArr.length,
        ),
      ).fill(""),
    ];
  }, []);

  return (
    <div className="relative w-full max-w-225 mt-10 border-gradient-rounded line-ray rounded-xl text-base font-semibold text-jet-black">
      <div className="flex flex-col w-full bg-eerie-black rounded-xl">
        <div
          className="py-4.5 -m-0.25 rounded-xl"
          style={{
            background: "linear-gradient(90deg, #00FFC2 0%, #7DDAFF 100%)",
          }}
        >
          <div className="flex justify-between px-10">
            <div className="w-[25%]">Available</div>
            <div className="w-[25%] text-center">Waitlist</div>
            <div className="w-[25%] text-right">Coming soon</div>
          </div>
        </div>
        <div className="text-white px-10">
          {maxArr.map((_, i) => (
            <div
              key={i}
              className="flex justify-between py-4 border-b-1 border-b-dark-gray"
            >
              <div className="w-[25%]">{availableArr?.[i]}</div>
              <div className="w-[25%] text-center">{waitlistArr?.[i]}</div>
              <div className="w-[25%] text-right">{comingSoonArr?.[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Map() {
  return (
    <div className="relative w-full flex flex-col items-center gap-10 pb-10">
      <div className="globe-map w-full">
        <GlobeMap />
      </div>
      <CountriesList />
    </div>
  );
}
