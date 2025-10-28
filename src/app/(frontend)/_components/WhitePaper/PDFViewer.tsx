"use client";

import { CDN_BASEURL } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Document, Page, pdfjs } from "react-pdf";
import { FadeLoader } from "react-spinners";

// load pdf.worker.js
pdfjs.GlobalWorkerOptions.workerSrc = `${CDN_BASEURL}/js/pdf.worker.min.mjs`;

function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <FadeLoader color="white" width={10} height={30} radius={20} margin={30} />
    </div>
  );
}

function LazyPage({
  pageNumber,
  width,
}: {
  pageNumber: number;
  width: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "100px" });
  return (
    <div ref={ref}>
      {inView ? (
        <Page
          pageNumber={pageNumber}
          width={width}
          devicePixelRatio={width >= 768 ? 1 : 2}
          renderMode="canvas"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onRenderSuccess={() => {
            console.log("pageNumber", pageNumber);
          }}
          loading={<Loader />}
          className="flex justify-center"
          canvasBackground="#282828"
        />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(1);

  const [width, setWidth] = useState(0);
  useEffect(() => {
    console.log(ref?.current?.clientWidth);
    if (ref?.current?.clientWidth) {
      setWidth(ref.current.clientWidth);
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      onContextMenu={(e) => e.preventDefault()} // 禁止右键
      className="h-screen w-full select-none" // 禁止文本选择
      data-width={width}
    >
      {width ? (
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          // options={{ disableWorker: false }}
          loading={<Loader />}
        >
          {Array.from(new Array(numPages), (_el, index) => (
            <LazyPage
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={width}
            />
          ))}
        </Document>
      ) : (
        <></>
      )}
    </div>
  );
}
