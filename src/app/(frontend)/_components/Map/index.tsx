"use client";

import dynamic from "next/dynamic";

const GlobeMap = dynamic(() => import("./GlobeMap"), { ssr: false });

export default function Map() {
  return <GlobeMap />;
}
