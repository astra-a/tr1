import { useEffect, useRef } from "react";
import { Matrix } from "@/lib/animations/Matrix/matrix.react";

export default function PixiMatrix({
  containerId,
  width,
  height,
  backgroundColor = { r: 0, g: 0, b: 0 },
  highlightColor = { r: 0, g: 255, b: 255 },
  darkColor = { r: 0, g: 0, b: 0 },
}: {
  containerId: string;
  width: number;
  height: number;
  backgroundColor?: { r: number; g: number; b: number };
  highlightColor?: { r: number; g: number; b: number };
  darkColor?: { r: number; g: number; b: number };
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glowMatrix = new Matrix(containerId, width, height, {
      boxSize: 0.3,
      backgroundColor,
      highlightColor,
      darkColor,
      fadeSpeed: 0.1,
      decay: 0.25,
      weightX: 0.8,
      weightY: 1.5,
      rangeFactor: 1.3,
      maxScale: 12.0,
      minGap: 8,
    });

    glowMatrix.init();

    return () => glowMatrix.app?.destroy(true);
  }, []);

  return <div ref={ref} id={containerId} />;
}
