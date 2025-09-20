"use client";

import Image from "next/image";
import { motion, useAnimationFrame, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CDN_BASEURL } from "@/constants";
import Footer from "../Footer";
import { useWindowSize } from "react-use";

const ICONS = [
  "/images/icon-ornament-0.svg",
  "/images/icon-ornament-1.svg",
  "/images/icon-ornament-2.svg",
  "/images/icon-ornament-3.svg",
  "/images/icon-ornament-4.svg",
  "/images/icon-ornament-5.svg",
  "/images/icon-ornament-6.svg",
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
    if (width >= 1536) {
      // 2xl
      return (18 + 10) * 4 * ICONS.length;
    } else if (width >= 1280) {
      // xl
      return (17 + 9) * 4 * ICONS.length;
    } else if (width >= 1024) {
      // lg
      return (16 + 8) * 4 * ICONS.length;
    } else if (width >= 768) {
      // md
      return (15 + 7) * 4 * ICONS.length;
    } else {
      // sm & xs
      return (14 + 6) * 4 * ICONS.length;
    }
  }, [width]);

  const ref = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (isInView && !paused && ref.current) {
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
    <motion.div
      className="relative w-full max-w-204 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      viewport={{ amount: "some" }}
    >
      <div ref={ref} className="w-full will-change-transform">
        <ul className="flex w-full gap-6 md:gap-7 lg:gap-8 xl:gap-9 2xl:gap-10 py-8">
          {[...ICONS, ...ICONS, ...ICONS].map((icon, i) => (
            <li
              key={i}
              id={`icon-${i}`}
              className="flex justify-center items-center size-14 md:size-15 lg:size-16 xl:size-17 2xl:size-18 flex-shrink-0 icon-box"
            >
              <Image
                src={icon}
                alt=""
                width={40}
                height={40}
                className="size-6 md:size-7 lg:size-8 xl:size-9 2xl:size-10"
              />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function VideoBackground({
  isInView,
  played,
  onEnded,
}: {
  isInView: boolean;
  played?: boolean;
  onEnded?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!ref?.current) return;
    if (played) return;
    if (isInView) {
      ref.current.play().finally();
    } else {
      ref.current.pause();
    }
    // ref.current.addEventListener('timeupdate', () => console.log('11', ref?.current?.currentTime))
  }, [isInView]);

  return (
    <div className="absolute inset-0 w-full h-full z-[0] morphing-particles-container overflow-hidden pointer-events-none">
      <video
        ref={ref}
        width={1920}
        height={1080}
        // autoPlay
        // loop
        muted
        controls={false}
        preload="auto"
        poster={`${CDN_BASEURL}/images/bg-fifth-poster.png`}
        className="w-full h-full object-cover"
        onEnded={() => {
          onEnded?.();
        }}
      >
        <source src={`${CDN_BASEURL}/images/bg-fifth.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}

export default function Fifth() {
  const [videoEnded, setVideoEnded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <div
      ref={ref}
      className="home-section page-fifth-group w-full h-screen-custom min-h-120 md:min-h-140 lg:min-h-160 flex flex-col relative overflow-hidden z-[4]"
    >
      <div className="page-fifth flex flex-auto justify-center relative md:min-h-100 lg:min-h-110 xl:min-h-130 2xl:min-h-130">
        <div className="absolute inset-0">
          <VideoBackground
            isInView={isInView}
            played={videoEnded}
            onEnded={() => {
              setVideoEnded(true);
            }}
          />
        </div>

        <div className="page-fifth-container flex flex-col justify-center items-center gap-16 w-full max-w-[1920px] relative px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-0 z-[1]">
          <Marquee speed={0.05} direction="left" isInView={isInView} />

          <motion.div
            className="flex flex-col justify-center items-center gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 relative z-1"
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            viewport={{ amount: "some" }}
          >
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.16667em] tracking-[-0.03em] text-mint-green-gradient text-shadow-black-10 text-center">
                Let’s Shape the Decentralized Future Together
              </h2>
              <p className="text-xs md:text-sm xl:text-base text-mint-green-gradient-2 text-center">
                Step into a new era where AI is your ally, blockchains unite
                without borders, and your sovereignty is secure — build
                intelligent, unstoppable solutions.
              </p>
            </div>
            <button
              type="button"
              className="text-xs md:text-sm xl:text-base text-jet-black btn-main rounded-lg px-6 py-2 cursor-pointer invisible"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </div>
      <Footer small={false} />
    </div>
  );
}
