"use client";

import { useWindowSize } from "react-use";
import dynamic from "next/dynamic";

const DesktopRoadmap = dynamic(() => import("./Desktop"), { ssr: false });
const MobileRoadmap = dynamic(() => import("./Mobile"), { ssr: false });

export default function Roadmap() {
  const { width } = useWindowSize();

  return width >= 768 ? <DesktopRoadmap /> : <MobileRoadmap />;
}
