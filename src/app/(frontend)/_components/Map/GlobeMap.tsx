"use client";

import Globe from "globe.gl";
import { useEffect, useRef } from "react";
import { Countries } from "../../_mocks/map";

// @see https://globe.gl/example/countries-population/
// @see https://github.com/vasturiano/globe.gl/blob/master/example/countries-population/index.html

const CATEGORIES = [
  { label: "Available", color: "#52FFA8" }, // rgb(82, 255, 168)
  { label: "Waitlist", color: "#15E4FF" }, // rgb(21, 228, 255)
  { label: "Coming soon", color: "#7452FF" }, // rgb(116, 82, 255)
  { label: "None", color: "#FF52E2" }, // rgb(255, 82, 226)
];

const CATEGORIES_COLOR: {
  [key: string]: { cap: string; side: string; base: number; increment: number };
} = {
  available: {
    cap: "#52FFA8",
    side: "rgba(82, 255, 168, 0.05)",
    base: 0.55,
    increment: 0.15,
  },
  waitlist: {
    cap: "#15E4FF",
    side: "rgba(21, 228, 255, 0.05)",
    base: 0.4,
    increment: 0.15,
  },
  "coming soon": {
    cap: "#7452FF",
    side: "rgba(116, 82, 255, 0.05)",
    base: 0.3,
    increment: 0.1,
  },
  none: {
    cap: "#FF52E2",
    side: "rgba(255, 82, 226, 0.05)",
    base: 0.2,
    increment: 0.1,
  },
};

export default function GlobeMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref?.current) return;

    const world = new Globe(ref.current)
      .width(ref.current.clientWidth)
      .height(ref.current.clientHeight)
      .backgroundColor("rgba(0,0,0,0)")
      // 大氣層的顏色
      // .atmosphereColor('red')
      // 地球儀材質影像
      .globeImageUrl("/images/earth-dark.jpg")
      // 攝影機位置(可以控制地球大小)
      .pointOfView({ altitude: 3 }, 5_000)
      // 多邊形的顏色
      .polygonCapColor(({ properties: d }: any) => {
        // console.log("feat.STATE", d.ADMIN, d.STATE);
        return CATEGORIES_COLOR?.[d?.STATE]?.cap ?? "#FF52E2";
      })
      // 多邊形凸起後的邊緣射線顏色
      .polygonSideColor(({ properties: d }: any) => {
        // console.log("feat.STATE", d.ADMIN, d.STATE);
        return CATEGORIES_COLOR?.[d?.STATE]?.side ?? "#FF52E2";
      })
      // 多邊形 hover 显示的内容
      .polygonLabel(
        ({ properties: d }: any) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          state: <i style="text-transform:capitalize">${d?.STATE}</i>
        `,
      );

    // Auto-rotate
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 1.8;
    world.controls().enableZoom = false;

    // 設定多邊形地圖圖層中要表示的多邊形形狀的清單。每個多邊形都顯示為從地球表面凸起的錐形。
    world.polygonsData(
      Countries.features,
      // filter((d) => !["AQ", "BR", "AU", "RU"].includes(d.properties.ISO_A2)),
    );

    setTimeout(
      () =>
        world
          // 多边形高度变化动画过渡的持续时间（毫秒）
          .polygonsTransitionDuration(4_000)
          // 多边形锥体高度的数值常量，以地球半径单位表示（0 = 0 高度（平面多边形），1 = 地球半径）
          .polygonAltitude(({ properties: d }: any) => {
            // 人口越多, 高度值越大
            // return Math.max(0.1, Math.sqrt(+d.POP_EST) * 7e-5);

            const heights: { base: number; increment: number } =
              CATEGORIES_COLOR?.[d?.STATE] ?? { base: 0.2, increment: 0.1 };
            if ("JP" === d.ISO_A2) {
              return heights.base + heights.increment;
            } else if ("IN" === d.ISO_A2) {
              return heights.base;
            } else {
              return heights.base + Math.random() * heights.increment;
            }
          }),
      3_000,
    );

    // fetch('../datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries => {
    //   world.polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'));
    //
    //   setTimeout(() => world
    //       .polygonsTransitionDuration(4000)
    //       .polygonAltitude(feat => Math.max(0.1, Math.sqrt(+feat.properties.POP_EST) * 7e-5))
    //     , 3000);
    // });
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={ref}></div>
      <div className="absolute top-5 left-5 flex gap-3 pointer-events-none">
        {CATEGORIES.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-xs"
              style={{ background: item.color }}
            />
            <div className="text-base text-white">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
