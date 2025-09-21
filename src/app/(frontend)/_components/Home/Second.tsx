"use client";

import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useWindowSize } from "react-use";
import SectionHeader from "../SectionHeader";

const LottiePlayer = dynamic(() => import("../LottiePlayer"), { ssr: false });

export default function Second() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const { width } = useWindowSize();

  return (
    <div
      ref={ref}
      className="home-section page-second w-full h-screen-custom min-h-210 sm:min-h-260 md:min-h-180 lg:min-h-210 xl:min-h-220 flex flex-col justify-center items-center gap-8 md:gap-10 lg:gap-12 xl:gap-14 2xl:gap-16 overflow-hidden relative z-[2]"
    >
      <div className="page-second-container flex flex-col items-center gap-6 w-full max-w-[1920px] relative z-[1] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-0">
        <SectionHeader
          image="/images/icon-zap.svg"
          tag="Features"
          title="Decentralized, Trustless, and Multi-Chain — By Design"
          description="The all-in-one decentralized AI platform for building, automating, and scaling in the Web3 era — with privacy and control at your core."
        />
        <div className="max-w-full flex flex-col items-center">
          <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 3xl:gap-16">
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
              <div className="relative z-[1] w-146 aspect-8/5">
                <LottiePlayer
                  fileUrl="https://cdn.lottielab.com/l/5Zd3EKE9Y78wcF.json"
                  playing={isInView}
                />
              </div>
            </motion.div>
          </div>
          <div className="max-w-full flex flex-col-reverse md:flex-row-reverse items-center gap-4 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 3xl:gap-16">
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
              <div className="relative z-[1] w-146 aspect-8/5">
                <LottiePlayer
                  fileUrl="https://cdn.lottielab.com/l/7yiqNKe9sDBJeB.json"
                  playing={isInView}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
