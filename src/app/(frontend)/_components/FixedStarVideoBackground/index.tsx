import { CDN_BASEURL } from "@/constants";

export default function FixedStarVideoBackground({
  wrapperClass,
}: {
  wrapperClass: string;
}) {
  return (
    <div
      className={`z-[0] morphing-particles-container overflow-hidden pointer-events-none ${wrapperClass}`}
    >
      <video
        width={1920}
        height={1080}
        autoPlay
        loop
        muted
        controls={false}
        preload="auto"
        poster={`${CDN_BASEURL}/images/bg-second-poster.png`}
        className="w-full h-full object-cover"
      >
        <source src={`${CDN_BASEURL}/images/bg-second.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
