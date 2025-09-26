"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Countries } from "../../_mocks/map";
import GlowingEdgeCard from "../../_components/GlowingEdgeCard";

const GlobeMap = dynamic(() => import("./GlobeMap"), { ssr: false });

function CountriesList() {
  const [availableArr, waitlistArr, columns, rows, width] = useMemo(() => {
    const _availableArr: string[] = [];
    const _waitlistArr: string[] = [];
    Countries.features.forEach((feature) => {
      switch (feature.properties.STATE) {
        case "available":
          _availableArr.push(feature.properties.ADMIN);
          break;
        case "waitlist":
          _waitlistArr.push(feature.properties.ADMIN);
          break;
      }
    });
    const _columns =
      _waitlistArr.length / _availableArr.length > 2
        ? 4
        : _waitlistArr.length / _availableArr.length > 1
          ? 3
          : 2;
    const _waitlistRows = Math.ceil(_waitlistArr.length / (_columns - 1));
    const _rows = Math.max(_availableArr.length, _waitlistRows);
    const _waitlistArr2 = [];
    for (let i = 0; i < _rows - 1; i++) {
      _waitlistArr2.push(
        _waitlistArr.slice(_waitlistRows * i, _waitlistRows * (i + 1)),
      );
    }
    return [
      _availableArr,
      _waitlistArr2,
      _columns,
      _rows,
      `${100 / _columns}%`,
    ];
  }, []);

  return (
    <div className="relative w-full max-w-270 mt-10 border-gradient-rounded line-ray rounded-xl text-base font-semibold text-jet-black">
      <GlowingEdgeCard autoPlayOnHover className="w-full h-full">
        <div className="flex flex-col w-full pb-4 bg-eerie-black rounded-xl">
          <div
            className="-m-0.25 rounded-xl"
            style={{
              background: "linear-gradient(90deg, #00FFC2 0%, #7DDAFF 100%)",
            }}
          >
            <div className="flex justify-between px-6">
              <div className="shrink-0 px-3 py-4 border-r-1 border-r-dark-gray" style={{ width }}>
                Available
              </div>
              <div className="flex-auto shrink-0 px-3 py-4">
                Waitlist
              </div>
            </div>
          </div>
          <div className="text-white px-6">
            {new Array(rows).fill("").map((_, i) => (
              <div
                key={i}
                className="flex justify-between border-b-1 border-b-dark-gray"
              >
                <div className="shrink-0 px-3 py-2 border-r-1 border-r-dark-gray" style={{ width }}>
                  {availableArr?.[i]}
                </div>
                <div className="shrink-0 px-3 py-2" style={{ width }}>
                  {waitlistArr?.[0]?.[i]}
                </div>
                {columns >= 3 && (
                  <div className="shrink-0 px-3 py-2" style={{ width }}>
                    {waitlistArr?.[1]?.[i]}
                  </div>
                )}
                {columns >= 4 && (
                  <div className="shrink-0 px-3 py-2" style={{ width }}>
                    {waitlistArr?.[2]?.[i]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlowingEdgeCard>
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
