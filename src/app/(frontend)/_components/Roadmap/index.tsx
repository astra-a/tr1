"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { LOGO_BIG, LOGO_SMALL } from "./assets";
import { Roadmaps } from "../../_mocks/roadmap";

import "./css.scss";
import {
  AnimationController,
  CenterSvgItem,
  SvgItem,
  TextItem,
  CONFIG,
  StateTransitionController,
} from "./helpers";

export default function Roadmap() {
  const circleContainerRef = useRef<HTMLDivElement>(null);

  const roadmapCenterIndex = useMemo(
    () => Math.ceil(Roadmaps.length / 2),
    Roadmaps,
  );

  useEffect(() => {
    if (!circleContainerRef?.current) {
      return;
    }

    // document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    function init() {
      const allItems = [];

      const innerContainerEl =
        circleContainerRef?.current?.querySelector<HTMLDivElement>(
          ".inner-container",
        );
      if (innerContainerEl) {
        Roadmaps.forEach((item, i) => {
          const angle = (i - roadmapCenterIndex + 1) * CONFIG.angleInterval;
          const itemEl = createDOMElement("item inner", angle, item.date, "");
          innerContainerEl.appendChild(itemEl);
          allItems.push(new TextItem(itemEl));
        });
      }

      const outerContainerEl =
        circleContainerRef?.current?.querySelector<HTMLDivElement>(
          ".outer-container",
        );
      if (outerContainerEl) {
        Roadmaps.forEach((item, i) => {
          const angle = (i - roadmapCenterIndex + 1) * CONFIG.angleInterval;
          const itemEl = createDOMElement(
            "item outer",
            angle,
            item.description,
            item.title,
          );
          itemEl.dataset.isOuter = "true";
          if (i === Roadmaps.length - 1)
            itemEl.dataset.isBoundaryTrigger = "true";
          outerContainerEl.appendChild(itemEl);
          allItems.push(new TextItem(itemEl));
        });
      }

      const smallLogoContainerEl =
        circleContainerRef?.current?.querySelector<HTMLDivElement>(
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

      const centerSvgEl = createDOMElement("center-svg-item", 0, "", "");
      circleContainerRef?.current?.appendChild(centerSvgEl);
      allItems.push(new CenterSvgItem(centerSvgEl));

      const animationController = new AnimationController(allItems);
      animationController.init();

      const stateTransitionController = new StateTransitionController(
        animationController,
        allItems,
      );
      stateTransitionController.init();
    }

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

    init();
  }, []);

  return (
    <div className="roadmap w-full h-full relative overflow-hidden">
      <div className="roadmap-bg-wrapper">
        <div className="roadmap-bg-container">
          <Image
            src="/images/bg-roadmap.png"
            alt=""
            width={1414}
            height={1491}
            className="w-full"
          />
        </div>
      </div>
      <div ref={circleContainerRef} className="circle-container">
        <div className="center-point" />
        <div className="inner-container" />
        <div className="outer-container" />
        <div className="small-logo-container">
          <div
            className="fixed-center-svg"
            dangerouslySetInnerHTML={{ __html: LOGO_SMALL }}
          />
        </div>
      </div>
    </div>
  );
}
