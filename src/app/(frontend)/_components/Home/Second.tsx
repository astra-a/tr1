"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";
import SectionHeader from "../SectionHeader";
import { CDN_BASEURL } from "@/constants";

function VideoBackground({
  url,
  poster,
  width,
  height,
  isInView,
}: {
  url: string;
  poster?: string;
  width?: number;
  height?: number;
  isInView?: boolean;
}) {
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
    <div className="w-full h-full z-[0] morphing-particles-container overflow-hidden pointer-events-none">
      <video
        ref={ref}
        width={width}
        height={height}
        autoPlay
        loop
        muted
        controls={false}
        preload="auto"
        poster={poster}
        className="w-full h-full"
      >
        <source src={url} type="video/mp4" />
      </video>
    </div>
  );
}

export default function Second() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const { width } = useWindowSize();

  return (
    <div
      ref={ref}
      className="home-section page-second w-full h-screen-custom flex flex-col justify-center items-center gap-8 md:gap-10 lg:gap-12 xl:gap-14 2xl:gap-16 overflow-hidden relative z-[2]"
    >
      <div className="page-second-container flex flex-col items-center gap-4 w-full max-w-[1920px] relative z-[1] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-0">
        <SectionHeader
          image="/images/icon-zap.svg"
          tag="Features"
          title="Decentralized, Trustless, and Multi-Chain — By Design"
          description="The all-in-one decentralized AI platform for building, automating, and scaling in the Web3 era — with privacy and control at your core."
        />
        <div className="max-w-full">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 3xl:gap-16">
            <motion.div
              className="flex flex-col gap-2 max-w-full md:max-w-[50%] xl:max-w-146"
              initial={{
                opacity: 0,
                x: width >= 768 ? -200 : 0,
                y: width >= 768 ? 0 : 100,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ amount: "some" }}
            >
              <h3 className="text-xl md:text-[1.375rem] xl:text-2xl leading-[1.33333333em] tracking-[-0.02em] font-semibold text-white">
                Multi-Chain Mastery
              </h3>
              <p className="text-xs md:text-sm xl:text-base text-cool-gray">
                Seamlessly connect to Ethereum, Solana, Binance Smart Chain, and
                beyond through one unified dashboard. No bridges, no barriers —
                pure multi-chain interoperability.
              </p>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                x: width >= 768 ? 200 : 0,
                y: width >= 768 ? 0 : 100,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ amount: "some" }}
              className="relative"
            >
              <div
                className="relative z-[1] w-140 aspect-8/6"
                data-border="border-gradient-rounded line-ray rounded-2xl overflow-hidden"
              >
                <VideoBackground
                  url={`${CDN_BASEURL}/images/bg-second-right-top.mp4`}
                  poster={`${CDN_BASEURL}/images/bg-second-right-top-poster.png`}
                  width={1280}
                  height={660}
                  isInView={isInView}
                />
              </div>
            </motion.div>
          </div>
          <div className="max-w-full -mt-40 flex flex-col-reverse md:flex-row-reverse justify-between items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 3xl:gap-16">
            <motion.div
              className="flex flex-col gap-2 max-w-full md:max-w-[50%] xl:max-w-146"
              initial={{
                opacity: 0,
                x: width >= 768 ? 200 : 0,
                y: width >= 768 ? 0 : 100,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ amount: "some" }}
            >
              <h3 className="text-xl md:text-[1.375rem] xl:text-2xl leading-[1.33333333em] tracking-[-0.02em] font-semibold text-white">
                Sovereign AI Agents
              </h3>
              <p className="text-xs md:text-sm xl:text-base text-cool-gray">
                Run your personal AI locally with zero-knowledge privacy — no
                data leaks, no centralized control, only you and your digital
                partner.
              </p>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                x: width >= 768 ? -200 : 0,
                y: width >= 768 ? 0 : 100,
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ amount: "some" }}
              className="relative"
            >
              <div
                className="relative z-[1] w-140 aspect-8/6"
                data-border="border-gradient-rounded line-ray rounded-2xl overflow-hidden"
              >
                <VideoBackground
                  url={`${CDN_BASEURL}/images/bg-second-left-bottom.mp4`}
                  poster={`${CDN_BASEURL}/images/bg-second-left-bottom-poster.png`}
                  width={1280}
                  height={660}
                  isInView={isInView}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
