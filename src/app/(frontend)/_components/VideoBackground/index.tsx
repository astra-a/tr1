"use client";

import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";

export default function VideoBackground({
  videos,
  isInView,
  className = "w-full h-full z-[0] morphing-particles-container overflow-hidden pointer-events-none",
}: {
  videos: {
    mobile: { url: string; poster?: string; width?: number; height?: number };
    desktop: { url: string; poster?: string; width?: number; height?: number };
  };
  isInView?: boolean;
  className?: string;
}) {
  const { width } = useWindowSize();

  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!ref?.current) return;
    if (isInView) {
      ref.current.play().finally();
    } else {
      ref.current.pause();
    }
    // ref.current.addEventListener('timeupdate', () => console.log('11', ref?.current?.currentTime))
  }, [isInView]);

  return (
    <div className={className}>
      <video
        ref={ref}
        width={width >= 768 ? videos.desktop.width : videos.mobile.width}
        height={width >= 768 ? videos.desktop.height : videos.mobile.height}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        preload="auto"
        className="w-full h-full object-cover"
        poster={width >= 768 ? videos.desktop.poster : videos.mobile.poster}
      >
        <source
          src={videos.mobile.url}
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <source
          src={videos.desktop.url}
          type="video/mp4"
          media="(min-width: 768px)"
        />
      </video>
    </div>
  );
}
