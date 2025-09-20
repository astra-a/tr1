"use client";

import { ReactNode, useEffect, useRef, MouseEvent } from "react";
import { cardUpdate, playAnimation } from "./helpers";

import "./css.scss";

// @see https://codepen.io/simeydotme/pen/RNWoPRj

export default function GlowingEdgeCard({
  className = "w-full h-full",
  initialPlay,
  children,
  autoPlayOnHover,
}: {
  className?: string;
  initialPlay?: boolean;
  autoPlayOnHover?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const latestMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref?.current) return;

    ref.current.addEventListener("pointermove", (e) => {
      latestMousePos.current = { x: e.clientX, y: e.clientY };
      cardUpdate(e, ref.current!);
    });

    if (initialPlay) {
      setTimeout(() => {
        playAnimation(ref.current!);
      }, 500);
    }
  }, [ref?.current, initialPlay]);

  const stopRef = useRef<() => void>(undefined);

  const handleMouseEnter = (e: MouseEvent) => {
    if (autoPlayOnHover && ref?.current) {
      // 計算滑鼠移入元素的位置, 相對於元素中心點的角度
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      let angle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      angle += 90; // 使高亮中心位於滑鼠移入元素的位置

      stopRef.current = playAnimation(ref.current!, angle, () => {
        const { x, y } = latestMousePos.current;
        if (x && y && ref?.current) {
          ref.current.dispatchEvent(
            new PointerEvent("pointermove", {
              clientX: x,
              clientY: y,
              bubbles: true,
            }),
          );
        }
      });
    }
  };

  const handleMouseLeave = () => {
    stopRef.current?.();
    stopRef.current = undefined;
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glowing-edge-card ${className}`}
    >
      <span className="glow" />
      {children}
    </div>
  );
}
