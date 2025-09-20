"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeader from "../SectionHeader";
import GlowingEdgeCard from "../GlowingEdgeCard";
import NewMatrix from "@/app/(frontend)/_components/NewMatrix";
import { CDN_BASEURL } from "@/constants";

const VC_ARRAY = [
  { name: "A16z", image: "/images/logo-a16z.svg", color: "#FFF" },
  { name: "Metamask", image: "/images/logo-metamask.svg", color: "#98FCE4" },
  {
    name: "Blockchai capital",
    image: "/images/logo-blockchai-capital.svg",
    color: "#FFF",
  },
  {
    name: "Multicoin Capital",
    image: "/images/logo-multicoin-capital.svg",
    color: "#73BBFF",
  },
  {
    name: "Protocol Lab",
    image: "/images/logo-protocol-lab.svg",
    color: "#73BBFF",
  },
  {
    name: "Token metrics",
    image: "/images/logo-token-metrics.svg",
    color: "#98FCE4",
  },
  {
    name: "Sequoia Capital",
    image: "/images/logo-sequoia-capital.svg",
    color: "#98FCE4",
  },
  { name: "PANTERA", image: "/images/logo-pantera.svg", color: "#FFF" },
  {
    name: "Token Metrics Ventures",
    image: "/images/logo-token-metrics-ventures.svg",
    color: "#FFF",
  },
  {
    name: "Framework Ventures",
    image: "/images/logo-framework-ventures.svg",
    color: "#73BBFF",
  },
  {
    name: "Lightspeed Partners",
    image: "/images/logo-lightspeed-partners.svg",
    color: "#FFF",
  },
  {
    name: "Digital Currency Group (DCG)",
    image: "/images/logo-dcg.svg",
    color: "#98FCE4",
  },
];

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
        poster={`${CDN_BASEURL}/images/bg-second-poster.png`}
        className="w-full h-full object-cover"
      >
        <source src={`${CDN_BASEURL}/images/bg-second.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}

export default function Fourth() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <div
      ref={ref}
      className="home-section page-fourth w-full h-screen-custom flex flex-auto justify-center items-center relative bg-black/70"
    >
      <VideoBackground isInView={isInView} />

      <div className="w-321.5 page-fourth-container relative z-[1] flex flex-col items-center gap-10">
        <SectionHeader
          image="/images/icon-thumbs-up.svg"
          tag="Our Values"
          title="Decentralized by Design  Intelligent by Nature"
          description="Merging adaptive AI with the resilience of distributed ledger technology to create trustless, permissionless systems built for global scale."
        />
        <motion.div
          className="w-full border-gradient-rounded line-ray rounded-[20px] shadow-[0_20px_32px_28px_#000,1px_1px_1px_0_rgba(255,255,255,0.1)_inset] backdrop-blur-[20px]"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          viewport={{ amount: "some" }}
        >
          <GlowingEdgeCard autoPlayOnHover>
            <div className="relative w-full h-full flex flex-wrap bg-[#040b0f] rounded-[20px]">
              <NewMatrix
                className="absolute inset-0 z-0 overflow-hidden rounded-inherit bg-eerie-black"
                baseColor={0x7453ff}
                hoverColor={0x52ffa8}
              />
              <div className="absolute inset-0 bg-[url(/images/logo-vc-bg.svg)] bg-top-left bg-size-[1045px 639px] bg-no-repeat z-1 pointer-events-none" />

              {VC_ARRAY.map((item, i) => (
                <div
                  key={i}
                  className="w-[25%] aspect-320/212 flex flex-col justify-center items-center gap-2 border-1 border-white/3 relative z-2 pointer-events-none"
                >
                  <div className="w-30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="w-full"
                    />
                  </div>
                  <p
                    className="text-sm leading-[2em] font-semibold uppercase"
                    style={{ color: item.color }}
                  >
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </GlowingEdgeCard>
        </motion.div>
      </div>
    </div>
  );
}
