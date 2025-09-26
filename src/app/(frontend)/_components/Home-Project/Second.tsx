"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { useWindowSize } from "react-use";
import SectionHeader from "../SectionHeader";
import { CDN_BASEURL } from "@/constants";
import GlowingEdgeCard from "../GlowingEdgeCard";

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
        className="w-full h-full object-cover"
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
          tag="Our Foundation"
          title="A Local-First AI + Web3 Ecosystem for the Decentralized Era"
          description="A trust-minimized intelligence network that unites AI agents, multi-chain protocols, and sovereign identities—built for openness, resilience, and human-centric design."
        />
        <div className="max-w-full 2xl:mt-6">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 3xl:gap-16">
            <motion.div
              className="flex flex-col gap-2 w-full xl:max-w-146 2xl:max-w-158"
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
                Multi-Chain Interoperability at the Core
              </h3>
              <p className="text-xs md:text-sm xl:text-base text-cool-gray">
                Ethereum, Solana, BNB Chain, Cosmos, Layer 2s—our architecture
                treats them not as isolated islands, but as nodes of a{" "}
                <b>global value web</b>. Unified routing, liquidity-aware paths,
                and cryptographic verifiability ensure assets and data move{" "}
                <b>freely and safely</b> across chains.
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
              className="relative z-[1] w-full max-w-120 2xl:max-w-140 aspect-2560/1440 border-gradient-rounded line-ray rounded-[20px] overflow-hidden"
            >
              <GlowingEdgeCard autoPlayOnHover>
                <VideoBackground
                  url={`${CDN_BASEURL}/images/bg-project-second-right-top.mp4`}
                  poster={`${CDN_BASEURL}/images/bg-project-second-right-top-poster.png`}
                  width={2560}
                  height={1440}
                  isInView={isInView}
                />
              </GlowingEdgeCard>
            </motion.div>
          </div>
          <div className="max-w-full -mt-5 2xl:mt-2 flex flex-col-reverse md:flex-row-reverse justify-between items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 3xl:gap-16">
            <motion.div
              className="flex flex-col gap-2 w-full xl:max-w-146 2xl:max-w-158"
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
                Every user runs a <b>personal AI companion</b> locally,
                fine-tuned by their preferences and protected by{" "}
                <b>zero-knowledge privacy guarantees</b>. These agents parse
                intent, execute on-chain actions, and interact across networks—
                <b>
                  without ever exposing private data or ceding control to
                  centralized clouds
                </b>
                .
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
              className="relative z-[1] w-full max-w-120 2xl:max-w-140 aspect-2560/1440 border-gradient-rounded line-ray rounded-[20px] overflow-hidden"
            >
              <GlowingEdgeCard autoPlayOnHover>
                <VideoBackground
                  url={`${CDN_BASEURL}/images/bg-project-second-left-bottom.mp4`}
                  poster={`${CDN_BASEURL}/images/bg-project-second-left-bottom-poster.png`}
                  width={2560}
                  height={1440}
                  isInView={isInView}
                />
              </GlowingEdgeCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
