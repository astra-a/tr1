"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Countries } from "../../_mocks/map";

const GlobeMap = dynamic(() => import("./GlobeMap"), { ssr: false });

function CountriesList() {
  const [availableArr, waitlistArr, comingSoonArr] = useMemo(() => {
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
    return [_availableArr, _waitlistArr, _comingSoonArr];
  }, []);

  return (
    <div className="relative w-full max-w-260 mt-10 border-gradient-rounded line-ray rounded-xl text-base font-semibold text-white">
      <div className="flex flex-col w-full p-4 bg-eerie-black rounded-xl">
        <div className="flex w-full py-2 border-b-1 border-b-dark-gray">
          <div className="p-4 w-35 flex-none">Available</div>
          <div className="p-4">
            <p>{availableArr.join(", ")}</p>
          </div>
        </div>
        <div className="flex w-full py-2 border-b-1 border-b-dark-gray">
          <div className="p-4 w-35 flex-none">Waitlist</div>
          <div className="p-4">
            <p>{waitlistArr.join(", ")}</p>
          </div>
        </div>
        <div className="flex w-full py-2">
          <div className="p-4 w-35 flex-none">Coming soon</div>
          <div className="p-4">
            <p>{comingSoonArr.join(", ")}</p>
          </div>
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
