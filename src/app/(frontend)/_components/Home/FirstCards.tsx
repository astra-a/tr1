"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GlowingEdgeCard from "../GlowingEdgeCard";

export default function FirstCards() {
  return (
    <motion.div
      className="flex items-center justify-center gap-4"
      initial={{ opacity: 0, x: 150 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      viewport={{ amount: "some" }}
    >
      <div className="feature-box max-w-24 md:max-w-27 lg:max-w-30 xl:max-w-34 2xl:max-w-37 3xl:max-w-42">
        <GlowingEdgeCard initialPlay>
          <div className="inner flex flex-col items-center justify-center gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3 3xl:gap-4 px-2.5 xl:px-3 2xl:px-4 3xl:px-5 py-2.5 xl:py-3 2xl:py-4 3xl:py-5.5">
            <Image
              src="/images/icon-clock.svg"
              alt=""
              width={44}
              height={44}
              className="size-7 md:size-8 lg:size-9 xl:size-10 2xl:size-11"
            />
            <p className="text-xs md:text-sm xl:text-base 2xl:text-lg leading-[1.2em] tracking-[-0.01em] text-white text-center">
              Real-Time Response
            </p>
          </div>
        </GlowingEdgeCard>
      </div>

      <div className="feature-box max-w-24 md:max-w-27 lg:max-w-30 xl:max-w-34 2xl:max-w-37 3xl:max-w-42">
        <GlowingEdgeCard initialPlay>
          <div className="inner flex flex-col items-center justify-center gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3 3xl:gap-4 px-2.5 xl:px-3 2xl:px-4 3xl:px-5 py-2.5 xl:py-3 2xl:py-4 3xl:py-5.5">
            <Image
              src="/images/icon-seamless.svg"
              alt=""
              width={44}
              height={44}
              className="size-7 md:size-8 lg:size-9 xl:size-10 2xl:size-11"
            />
            <p className="text-xs md:text-sm xl:text-base 2xl:text-lg leading-[1.2em] tracking-[-0.01em] text-white text-center">
              Seamless Integration
            </p>
          </div>
        </GlowingEdgeCard>
      </div>
    </motion.div>
  );
}
