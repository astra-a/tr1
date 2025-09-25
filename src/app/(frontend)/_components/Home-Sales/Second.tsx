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
          tag="Features"
          title="The World’s First Local-First AI + Multi-Chain Operating System for Web3"
          description={`An all-in-one, local-first AI platform to <b>build</b>, <b>automate</b>, and <b>scale</b> in the Web3 era—where <b>self-custody</b>, <b>zero-knowledge privacy</b>, and <b>sovereign control</b> are the defaults, not add-ons.`}
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
                Multi-Chain Mastery
              </h3>
              <p className="text-xs md:text-sm xl:text-base text-cool-gray">
                Plug into <b>Ethereum</b>, <b>Solana</b>, <b>BNB Chain</b>,{" "}
                <b>Layer 2s</b>, and emerging ecosystems through a single,
                intent-driven dashboard. Our routing engine abstracts wallets,
                RPCs, and token formats so you ship faster with fewer moving
                parts.{" "}
                <b>
                  No brittle manual bridges, no chain-hopping guesswork—just
                  permissionless, programmable interoperability
                </b>{" "}
                with built-in risk scoring, fee simulation, and slippage guards.
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
              className="relative z-[1] w-full max-w-120 2xl:max-w-140 aspect-2496/1408 border-gradient-rounded line-ray rounded-[20px] overflow-hidden"
            >
              <GlowingEdgeCard autoPlayOnHover>
                <VideoBackground
                  url={`${CDN_BASEURL}/images/bg-sales-second-right-top.mp4`}
                  poster={`${CDN_BASEURL}/images/bg-sales-second-right-top-poster.png`}
                  width={2496}
                  height={1408}
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
                Run your <b>personal AI</b> locally—fine-tuned to your
                preferences, sealed by device-level keys, and{" "}
                <b>shielded by ZK/MPC</b>. Your intent becomes executable
                on-chain actions without exposing your data to centralized
                servers.{" "}
                <b>
                  No data extraction. No third-party custody. Only you and your
                  verifiable digital counterpart
                </b>
                , signing with <b>account-abstraction</b> policies, spending
                caps, and human-in-the-loop confirmations when it matters.
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
              className="relative z-[1] w-full max-w-120 2xl:max-w-140 aspect-1920/1080 border-gradient-rounded line-ray rounded-[20px] overflow-hidden"
            >
              <GlowingEdgeCard autoPlayOnHover>
                <VideoBackground
                  url={`${CDN_BASEURL}/images/bg-sales-second-left-bottom.mp4`}
                  poster={`${CDN_BASEURL}/images/bg-sales-second-left-bottom-poster.png`}
                  width={1920}
                  height={1080}
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
