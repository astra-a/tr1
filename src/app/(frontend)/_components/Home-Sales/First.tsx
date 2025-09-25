"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { CDN_BASEURL } from "@/constants";
import Link from "next/link";

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
  }, [isInView]);

  return (
    <div className="absolute inset-0 w-full h-full z-[0] morphing-particles-container overflow-hidden pointer-events-none">
      <video
        ref={ref}
        width={1920}
        height={1080}
        autoPlay
        loop
        muted
        controls={false}
        preload="auto"
        poster={`${CDN_BASEURL}/images/bg-sales-first-poster.png`}
        className="w-full h-full object-cover"
      >
        <source
          src={`${CDN_BASEURL}/images/bg-sales-first.mp4`}
          type="video/mp4"
        />
      </video>
    </div>
  );
}

export default function First() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <div
      ref={ref}
      className="home-section page-first w-full h-screen-custom flex justify-center bg-black relative overflow-hidden z-[1]"
    >
      <div className="relative w-full h-full flex justify-center">
        <VideoBackground isInView={isInView} />

        <div className="page-first-container flex flex-col md:flex-row justify-between gap-5 md:gap-10 w-full max-w-[1920px] h-full pt-10 md:pt-20 pb-10 md:pb-20 pl-8 lg:pl-12 xl:pl-16 2xl:pl-20 3xl:pl-32 pr-8 lg:pr-12 xl:pr-16 2xl:pr-18 3xl:pr-20 z-[1]">
          <div className="w-full md:w-[64%] 2xl:w-[62%] 3xl:max-w-[60%] pt-6 md:pt-0 flex flex-col justify-center gap-4 md:gap-15">
            <div className="flex flex-col gap-2 md:gap-5">
              <motion.div
                className="text-xs md:text-sm xl:text-base font-semibold text-bright-aqua"
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                viewport={{ amount: "some" }}
              >
                Secure, adaptive, and human-level conversations
              </motion.div>
              <motion.div
                className="text-4xl lg:text-5xl xl:text-7xl 2xl:text-[84px] 3xl:text-[100px] font-semibold leading-[1.2em] tracking-[-0.03em] text-white flex flex-col"
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                viewport={{ amount: "some" }}
              >
                <p>
                  <span className="text-bright-aqua">A</span>I Empowered
                </p>
                <p>
                  <span className="text-bright-aqua">I</span>nteroperable Trust
                </p>
                <p>
                  <span className="text-bright-aqua">O</span>pen Systems
                </p>
                <p>
                  <span className="text-bright-aqua">S</span>mart Sovereignty
                </p>
              </motion.div>
            </div>
            <motion.div
              className="lg:w-[90%] xl:w-[74%] 2xl:w-[64%] 3xl:w-[53%] flex flex-col gap-3 md:gap-6"
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ amount: "some" }}
            >
              <div
                className={`glow-text ${isInView ? "" : "paused"} text-xs md:text-sm xl:text-base text-light-blue-gray`}
              >
                Built on distributed ledgers and cross-chain interoperability,
                it streamlines blockchain interaction — from Ethereum to Solana
                to BSC — with AI managing contracts, transfers, and security,
                all while you retain full control.
              </div>
              <div className="flex items-center gap-7.5">
                <a
                  className=""
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/icon-twitter.svg"
                    alt="Twitter"
                    width={20}
                    height={20}
                    className="size-4 lg:size-5"
                  />
                </a>
                <a
                  className=""
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/icon-telegram.svg"
                    alt="Telegram"
                    width={20}
                    height={20}
                    className="size-4 lg:size-5"
                  />
                </a>
              </div>
            </motion.div>
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ margin: "150px" }}
            >
              <Link
                className="flex text-sm md:text-base xl:text-lg text-jet-black btn-main rounded-lg px-6 xl:px-7 py-2 xl:py-3"
                href={process.env.NEXT_PUBLIC_PROJECT_URL || ""}
                target="_blank"
              >
                Go to Project
              </Link>
            </motion.div>
          </div>
          {/*<div className="flex flex-col justify-center gap-4 md:gap-20 lg:gap-24 xl:gap-28 2xl:gap-30">*/}
          {/*  <div className="flex flex-col gap-2 md:gap-28 lg:gap-32 xl:gap-36 2xl:gap-40 w-full md:w-38 xl:w-40">*/}
          {/*    <motion.div*/}
          {/*      className="text-xs md:text-sm xl:text-base font-semibold text-bright-aqua text-center md:text-right"*/}
          {/*      initial={{ opacity: 0, x: 150 }}*/}
          {/*      whileInView={{ opacity: 1, x: 0 }}*/}
          {/*      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}*/}
          {/*      viewport={{ amount: "some" }}*/}
          {/*    >*/}
          {/*      Smart Contracts, Smarter Execution*/}
          {/*    </motion.div>*/}
          {/*    <motion.div*/}
          {/*      className="text-xs md:text-sm xl:text-base font-semibold text-bright-aqua text-center md:text-right"*/}
          {/*      initial={{ opacity: 0, x: 150 }}*/}
          {/*      whileInView={{ opacity: 1, x: 0 }}*/}
          {/*      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}*/}
          {/*      viewport={{ amount: "some" }}*/}
          {/*    >*/}
          {/*      AI-Enhanced Security*/}
          {/*    </motion.div>*/}
          {/*  </div>*/}
          {/*  {isInView && <FirstCards />}*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}
