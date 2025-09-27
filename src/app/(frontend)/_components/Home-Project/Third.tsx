"use client";

import Image from "next/image";
import SectionHeader from "../SectionHeader";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationFrame, useInView } from "framer-motion";
import { useWindowSize } from "react-use";
import { CDN_BASEURL } from "@/constants";
import GlowingEdgeCard from "../GlowingEdgeCard";

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
      return 66 * 4 * FEATURES.length;
    } else {
      // xs
      return 62 * 4 * FEATURES.length;
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
                  className="flex w-62 sm:w-66 md:w-68 lg:w-72 xl:w-84 2xl:w-90 3xl:w-100 items-center gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 py-4 md:py-5 lg:py-6 xl:py-7 feature-box"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="size-4 lg:size-5"
                  />
                  <p className="text-sm xl:text-base font-semibold text-white whitespace-normal">
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
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!ref?.current) return;
    if (isInView) {
      ref.current.play().finally();
    } else {
      ref.current.pause();
    }
    // ref.current.addEventListener('timeupdate', () => console.log('11', ref?.current?.currentTime))
  }, [isInView, ref?.current]);

  return (
    <div className="w-full h-full z-[0] morphing-particles-container overflow-hidden pointer-events-none">
      <video
        ref={ref}
        width={2560}
        height={1440}
        autoPlay
        loop
        muted
        controls={false}
        preload="auto"
        className="w-full h-full object-cover"
        poster={`${CDN_BASEURL}/images/bg-project-third-poster.png`}
      >
        <source
          src={`${CDN_BASEURL}/images/bg-project-third.mp4`}
          type="video/mp4"
        />
      </video>
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
      <div className="page-third-container w-full flex flex-auto flex-col justify-between items-center relative px-4 sm:px-6 md:px-8 lg:px-10 2xl:px-0">
        <div />
        <div className="w-full flex flex-col justify-start items-center gap-12 md:gap-14 lg:gap-16 xl:gap-18 2xl:gap-20 3xl:gap-22 relative z-[1]">
          <div className="px-4 sm:px-6 md:px-0">
            <SectionHeader
              image="/images/icon-thumbs-up.svg"
              tag="The Vision"
              title="Intelligence + Decentralization = A New Social Operating System"
              description={`Our mission is to merge adaptive AI reasoning with the fault tolerance of distributed ledgers, enabling <b>trustless, permissionless collaboration</b> at global scale.`}
            />
          </div>
        </div>

        <motion.div
          className="relative max-w-320 md:max-h-[40vh] aspect-16/9 md:aspect-16/5 mt-7 md:mt-0 mb-12 md:mb-0 border-gradient-rounded line-ray rounded-[20px] overflow-hidden"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          viewport={{ amount: "some" }}
        >
          <GlowingEdgeCard autoPlayOnHover>
            <VideoBackground isInView={isInView} />
          </GlowingEdgeCard>
        </motion.div>

        <div className="flex flex-col w-full gap-0.5 bg-jet-black relative z-[1]">
          <div className="w-full">
            <Marquee speed={0.05} direction="left" isInView={isInView} />
          </div>
          <div className="flex justify-center md:px-6 lg:px-8 xl:px-10 2xl:px-14 3xl:px-16 py-4 md:py-5 lg:py-6 xl:py-7 border-b-[0.6px] border-[#9f9f9f]">
            <p className="text-sm xl:text-base font-semibold text-white">
              By uniting adaptive AI with resilient decentralized
              infrastructure, we deliver smarter, faster, and truly sovereign
              experiences — built to empower human potential worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
