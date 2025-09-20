import { useEffect, useRef } from "react";
import { MatrixEffect } from "@/lib/animations/New matrix";

export default function NewMatrix({
  className = "",
  boxSize = 2.7,
  spacing = 10,
  baseColor = 0x555555,
  hoverColor = 0x00ffff,
  delayFactor = 0.1,
}: {
  className?: string;
  boxSize?: number;
  spacing?: number;
  baseColor?: number;
  hoverColor?: number;
  delayFactor?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref?.current) return;
    if (ref.current.hasChildNodes()) return;
    if (!ref.current?.clientWidth || !ref.current.clientHeight) return;

    new MatrixEffect(ref.current, {
      canvasWidth: ref.current.clientWidth,
      canvasHeight: ref.current.clientHeight,
      boxSize,
      spacing,
      baseColor,
      hoverColor,
      delayFactor,
    });
  }, [ref?.current?.clientWidth, ref?.current?.clientHeight]);

  return <div ref={ref} className={className} />;
}
