"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { LOGO_BIG, LOGO_SMALL } from "../assets";
import { Roadmaps } from "../../../_mocks/roadmap";

import "./css.scss";
import {
  AnimationController,
  CenterSvgItem,
  SvgItem,
  TextItem,
  CONFIG,
  OuterTextCarousel,
  CarouselSyncController,
} from "./helpers";

export default function Roadmap() {
  const circleContainerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  // 修正 1：新增最外层容器引用，用于事件监听范围控制
  const roadmapContainerRef = useRef<HTMLDivElement>(null);

  // 计算中心索引，用于确定 TextItem 的初始角度
  const roadmapCenterIndex = useMemo(
    () => Math.ceil(Roadmaps.length / 2),
    [Roadmaps.length],
  );

  useEffect(() => {
    if (!circleContainerRef?.current || !outerContainerRef?.current) {
      return;
    }

    window.scrollTo(0, 0);

    // 修正 2：将 createDOMElement 提前定义，确保在 init 中可以使用
    function createDOMElement(
      className: string,
      angle: number,
      content: string,
      title: string,
    ) {
      const itemEl = document.createElement("div");
      itemEl.className = className;
      itemEl.dataset.angle = angle.toString();

      if (className !== "center-svg-item") {
        itemEl.style.setProperty("--a", `${angle}deg`);
      }

      if (content) {
        const blockEl = document.createElement("div");
        blockEl.className = "block";
        if (title) {
          const titleEl = document.createElement("div");
          titleEl.className = "title";
          titleEl.textContent = title;
          blockEl.appendChild(titleEl);
          const contentEl = document.createElement("div");
          contentEl.className = "content";
          contentEl.textContent = content;
          blockEl.appendChild(contentEl);
        } else {
          blockEl.textContent = content;
        }
        itemEl.appendChild(blockEl);
      } else {
        if (className === "center-svg-item") {
          itemEl.innerHTML = LOGO_BIG;
        } else if (className === "svg-item") {
          const svgContainerEl = document.createElement("div");
          svgContainerEl.className = "svg-container";
          // 假设 LOGO_SMALL 是一个包含 SVG 标记的字符串
          svgContainerEl.innerHTML = LOGO_SMALL;
          itemEl.appendChild(svgContainerEl);
        }
      }

      if (className !== "center-svg-item") {
        itemEl.style.transform = "rotate(30deg)";
        itemEl.style.animation = "fadeToCenter 2s forwards";
      }

      return itemEl;
    }

    let animationController: AnimationController; // 修正 3：提升变量作用域

    function init() {
      const allItems = [];

      // 1. 初始化内圈 TextItem
      const innerContainerEl =
        circleContainerRef.current!.querySelector<HTMLDivElement>(
          ".inner-container",
        );
      if (innerContainerEl) {
        Roadmaps.forEach((item, i) => {
          // 保持角度计算与 helpers.ts 中 rotateToIndex 方法的逻辑一致
          const angle = (i - roadmapCenterIndex + 1) * CONFIG.angleInterval;
          const itemEl = createDOMElement("item inner", angle, item.date, "");
          innerContainerEl.appendChild(itemEl);
          allItems.push(new TextItem(itemEl));
        });
      }

      // 2. 初始化小 Logo SvgItem
      const smallLogoContainerEl =
        circleContainerRef.current!.querySelector<HTMLDivElement>(
          ".small-logo-container",
        );
      if (smallLogoContainerEl) {
        for (let i = -1; i <= 2; i += 1) {
          const itemEl = createDOMElement(
            "svg-item",
            CONFIG.angleInterval * i,
            "",
            "",
          );
          smallLogoContainerEl.appendChild(itemEl);
          allItems.push(new SvgItem(itemEl));
        }
      }

      // 3. 初始化中心 Logo
      const centerSvgEl = createDOMElement("center-svg-item", 0, "", "");
      circleContainerRef.current!.appendChild(centerSvgEl);
      allItems.push(new CenterSvgItem(centerSvgEl));

      // 4. 创建 AnimationController
      animationController = new AnimationController(allItems);
      animationController.init();
    }

    // 修正 4：按顺序调用 init
    init();

    // --- 集中控制逻辑 ---
    // 5. 创建 OuterTextCarousel
    const outerCarousel = new OuterTextCarousel(outerContainerRef.current!);
    outerCarousel.init(Roadmaps);

    // 6. 创建并启动 CarouselSyncController
    const syncController = new CarouselSyncController(
      outerCarousel,
      animationController,
      Roadmaps,
      roadmapContainerRef, // 传递最外层容器引用
    );
    syncController.init();

    // 7. 清理函数
    return () => syncController.dispose();
  }, [roadmapCenterIndex]);

  return (
    // 修正 5：绑定最外层引用，用于 wheel 事件的监听范围
    <div
      className="roadmap w-full h-full relative overflow-hidden"
      ref={roadmapContainerRef}
    >
      <div className="roadmap-bg-wrapper">
        <div className="roadmap-bg-container">
          {/* 假设图片路径正确 */}
          <Image
            src="/images/bg-roadmap.png"
            alt=""
            width={1414}
            height={1491}
            className="w-full"
          />
        </div>
      </div>

      {/* 内圈文字 + 小 logo */}
      <div ref={circleContainerRef} className="circle-container">
        <div className="center-point" />
        <div className="inner-container" />
        <div className="small-logo-container">
          <div
            className="fixed-center-svg"
            dangerouslySetInnerHTML={{ __html: LOGO_SMALL }}
          />
        </div>
      </div>

      {/* 外圈文字 Carousel */}
      <div className="outer-container" ref={outerContainerRef}>
        <div className="outer" />
      </div>
    </div>
  );
}
