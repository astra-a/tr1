"use client";

import Image from "next/image";
import SectionHeader from "../SectionHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useInView } from "framer-motion";
import { useWindowSize } from "react-use";
import { CDN_BASEURL } from "@/constants";

const FEATURES = [
  { icon: "/images/icon-review.svg", text: "Decentralized Intelligence" },
  { icon: "/images/icon-clock-up-arrow.svg", text: "Cross-Chain Freedom" },
  { icon: "/images/icon-time-twenty-four.svg", text: "Sovereignty & Security" },
  { icon: "/images/icon-sack-dollar.svg", text: "Scalable Without Limits" },
];

function Marquee({
  speed,
  direction,
  isInView = true,
}: {
  speed: number;
  direction: "left" | "right";
  isInView?: boolean;
}) {
  const { width } = useWindowSize();
  const distance = useMemo(() => {
    if (width >= 1920) {
      // 3xl
      return 100 * 4 * FEATURES.length;
    } else if (width >= 1536) {
      // 2xl
      return 90 * 4 * FEATURES.length;
    } else if (width >= 1280) {
      // xl
      return 84 * 4 * FEATURES.length;
    } else if (width >= 1024) {
      // lg
      return 72 * 4 * FEATURES.length;
    } else if (width >= 768) {
      // md
      return 68 * 4 * FEATURES.length;
    } else if (width >= 640) {
      // sm
      return 60 * 4 * FEATURES.length;
    } else {
      // xs
      return 55 * 4 * FEATURES.length;
    }
  }, [width]);

  const ref = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (isInView && !paused && ref?.current) {
      x.current += speed * delta * ("left" === direction ? -1 : 1);
      const width = distance || ref.current.clientWidth;
      if (
        ("left" === direction && -x.current >= width) ||
        ("right" === direction && x.current >= width)
      ) {
        x.current = 0;
      }
      ref.current.style.transform = `translateX(${x.current}px)`;
    }
  });

  return (
    <div
      ref={ref}
      className="w-full will-change-transform"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ul className="flex w-full">
        {[0, 1, 2, 3].map((_, j) => (
          <li key={j}>
            <div className="flex flex-nowrap justify-center items-center w-min relative">
              {FEATURES.map((item, i) => (
                <div
                  key={i}
                  className="flex w-55 sm:w-60 md:w-68 lg:w-72 xl:w-84 2xl:w-90 3xl:w-100 items-center gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-4 md:py-5 lg:py-6 xl:py-7 feature-box"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="size-4 lg:size-5"
                  />
                  <p className="text-xs md:text-sm xl:text-base font-semibold text-white whitespace-normal">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VideoBackground({ isInView }: { isInView: boolean }) {
  const [phase, setPhase] = useState<"intro" | "loop">("intro");

  const introRef = useRef<HTMLVideoElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (isInView) {
      ("intro" === phase ? introRef : loopRef).current?.play().finally();
    } else {
      introRef.current?.pause();
      loopRef.current?.pause();
    }
    // ref.current.addEventListener('timeupdate', () => console.log('11', ref?.current?.currentTime))
  }, [isInView, introRef?.current, loopRef?.current]);

  return (
    <div className="w-full h-full z-[0] morphing-particles-container overflow-hidden pointer-events-none">
      <video
        ref={introRef}
        width={1920}
        height={1080}
        autoPlay
        muted
        controls={false}
        loop={false}
        preload="auto"
        className={`w-full h-full object-cover ${"intro" === phase ? "" : "hidden"}`}
        poster={`${CDN_BASEURL}/images/bg-third-1-poster.png`}
        src={`${CDN_BASEURL}/images/bg-third-1.mp4`}
        onEnded={() => {
          if ("intro" === phase) {
            setPhase("loop");
            loopRef.current?.play().finally();
          }
        }}
      />
      <video
        ref={loopRef}
        width={1920}
        height={1080}
        autoPlay
        muted
        controls={false}
        loop={true}
        preload="auto"
        className={`w-full h-full object-cover ${"loop" === phase ? "" : "hidden"}`}
        poster={`${CDN_BASEURL}/images/bg-third-2-poster.png`}
        src={`${CDN_BASEURL}/images/bg-third-2.mp4`}
      />
    </div>
  );
}

export default function Third() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <div
      ref={ref}
      className="home-section page-third w-full h-screen-custom flex flex-col justify-center items-center relative overflow-hidden z-[3]"
    >
      <div className="page-third-container w-full flex flex-auto flex-col justify-between items-center relative">
        <div />
        <div className="w-full flex flex-col justify-start items-center gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20 3xl:gap-22 relative z-[1]">
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-0">
            <SectionHeader
              image="/images/icon-thumbs-up.svg"
              tag="Our Values"
              title="Decentralized by Design  Intelligent by Nature"
              description="Merging adaptive AI with the resilience of distributed ledger technology to create trustless, permissionless systems built for global scale."
            />
          </div>
        </div>

        <motion.div
          className="relative max-w-320 max-h-[40vh] aspect-16/5 border-gradient-rounded line-ray rounded-[20px] overflow-hidden"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          viewport={{ amount: "some" }}
        >
          <VideoBackground isInView={isInView} />
        </motion.div>

        <div className="flex flex-col w-full gap-0.5 bg-jet-black relative z-[1]">
          <div className="w-full">
            <Marquee speed={0.05} direction="left" isInView={isInView} />
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 3xl:px-16 py-4 md:py-5 lg:py-6 xl:py-7 border-b-[0.6px] border-[#9f9f9f]">
            <p className="text-xs md:text-sm xl:text-base font-semibold text-white">
              By uniting adaptive AI with resilient decentralized
              infrastructure, we deliver smarter, faster, and truly sovereign
              experiences — built to empower human potential worldwide.
            </p>
            <Image
              src="/images/icon-benefit-increase.svg"
              alt=""
              width={20}
              height={20}
              className="size-4 lg:size-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
