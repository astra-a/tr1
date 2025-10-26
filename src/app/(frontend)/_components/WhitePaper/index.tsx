"use client";

import { CDN_BASEURL } from "@/constants";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

export default function WhitePaper() {
  console.log(`${CDN_BASEURL}/aios-whitepaper.pdf`);

  return (
    <div className="white-paper w-full">
      <PDFViewer fileUrl={`${CDN_BASEURL}/aios-whitepaper.pdf`} />
    </div>
  );
}
