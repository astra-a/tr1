"use client";

import { useMemo } from "react";
import { Countries } from "../../_mocks/map";
import GlowingEdgeCard from "../../_components/GlowingEdgeCard";
import { useWindowSize } from "react-use";

export default function CountriesList() {
  const { width } = useWindowSize();

  const [availableArr, waitlistArr, columns, rows, columnWidth] =
    useMemo(() => {
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
      let _columns =
        _waitlistArr.length / _availableArr.length > 2
          ? 4
          : _waitlistArr.length / _availableArr.length > 1
            ? 3
            : 2;
      if (width < 640 && _columns > 2) {
        _columns = 2;
      } else if (width < 1024 && _columns > 3) {
        _columns = 3;
      }
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
    }, [width]);

  return (
    <div className="w-full max-w-280 px-5 sm:px-6 md:px-7 lg:px-8 xl:px-9 2xl:px-10 md:mt-6 lg:mt-8 xl:mt-10 text-xs md:text-sm lg:text-base font-semibold text-jet-black">
      <div className="relative w-full border-gradient-rounded line-ray rounded-xl">
        <GlowingEdgeCard autoPlayOnHover className="w-full h-full">
          <div className="flex flex-col w-full pb-4 bg-eerie-black rounded-xl">
            <div
              className="-m-0.25 rounded-xl"
              style={{
                background: "linear-gradient(90deg, #00FFC2 0%, #7DDAFF 100%)",
              }}
            >
              <div className="flex justify-between px-4 md:px-5 xl:px-6">
                <div
                  className="shrink-0 px-3 py-4 border-r-1 border-r-dark-gray"
                  style={{ width: columnWidth }}
                >
                  Available
                </div>
                <div className="flex-auto shrink-0 px-3 py-4">Waitlist</div>
              </div>
            </div>
            <div className="text-white px-4 md:px-5 xl:px-6">
              {new Array(rows).fill("").map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b-1 border-b-dark-gray"
                >
                  <div
                    className="shrink-0 px-3 py-2 border-r-1 border-r-dark-gray"
                    style={{ width: columnWidth }}
                  >
                    {availableArr?.[i]}
                  </div>
                  <div
                    className="shrink-0 px-3 py-2"
                    style={{ width: columnWidth }}
                  >
                    {waitlistArr?.[0]?.[i]}
                  </div>
                  {columns >= 3 && (
                    <div
                      className="shrink-0 px-3 py-2"
                      style={{ width: columnWidth }}
                    >
                      {waitlistArr?.[1]?.[i]}
                    </div>
                  )}
                  {columns >= 4 && (
                    <div
                      className="shrink-0 px-3 py-2"
                      style={{ width: columnWidth }}
                    >
                      {waitlistArr?.[2]?.[i]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </GlowingEdgeCard>
      </div>
    </div>
  );
}
