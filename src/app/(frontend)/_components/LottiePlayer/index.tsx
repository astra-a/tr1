"use client";

import Lottie from "@lottielab/lottie-player/react";

export default function LottiePlayer({
  fileUrl,
  playing = true,
}: {
  fileUrl: string;
  playing?: boolean;
}) {
  return (
    <Lottie
      className="lottie-player w-full h-full"
      src={fileUrl}
      autoplay={false}
      playing={playing}
      loop={true}
    />
  );
}
