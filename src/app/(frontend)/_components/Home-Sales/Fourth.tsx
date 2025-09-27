"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeader from "../SectionHeader";
import GlowingEdgeCard from "../GlowingEdgeCard";
import NewMatrix from "../NewMatrix";

const VC_ARRAY = [
  { name: "A16z", image: "/images/logo-a16z.svg", color: "#FFF" },
  { name: "Metamask", image: "/images/logo-metamask.svg", color: "#98FCE4" },
  {
    name: "Blockchain capital",
    image: "/images/logo-blockchain-capital.svg",
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
    name: "Spartan",
    image: "/images/logo-spartan.svg",
    color: "#98FCE4",
  },
  {
    name: "Sequoia Capital",
    image: "/images/logo-sequoia-capital.svg",
    color: "#98FCE4",
  },
  { name: "PANTERA", image: "/images/logo-pantera.svg", color: "#FFF" },
  {
    name: "Kleinerperkins",
    image: "/images/logo-kleinerperkins.svg",
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

export default function Fourth() {
  return (
    <div className="home-section page-fourth w-full h-screen-custom flex flex-auto justify-center items-center relative">
      <div className="page-fourth-container relative z-[1] flex flex-col items-center gap-6 md:gap-10 px-4 md:px-0">
        <SectionHeader
          image="/images/icon-thumbs-up.svg"
          tag="Our Ecosystem"
          title="Backed by Visionaries Fueling the Next Decentralized Revolution"
          description={`From <b>wallet automation</b> to <b>cross-chain orchestration</b>, our local-first AI absorbs Web3 complexity so builders and power users can focus on outcomes—not tooling.`}
        />
        <motion.div
          className="w-full md:w-240 2xl:w-321.5 border-gradient-rounded line-ray rounded-[20px] shadow-[0_20px_32px_28px_#000,1px_1px_1px_0_rgba(255,255,255,0.1)_inset] backdrop-blur-[20px]"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          viewport={{ amount: "some" }}
        >
          <GlowingEdgeCard autoPlayOnHover>
            <div className="relative w-full h-full flex flex-wrap gap-2 sm:gap-3 md:gap-0 px-2 md:px-0 py-6 md:py-0 bg-[#040b0f] rounded-[20px]">
              <NewMatrix
                className="absolute inset-0 z-0 overflow-hidden rounded-inherit bg-eerie-black"
                baseColor={0x7453ff}
                hoverColor={0x52ffa8}
              />
              <div className="absolute inset-0 md:bg-[url(/images/logo-vc-bg.svg)] bg-top-left bg-contain bg-no-repeat z-1 pointer-events-none" />

              {VC_ARRAY.map((item, i) => (
                <div
                  key={i}
                  className="w-[calc(50%-4px)] sm:w-[calc(33.333333%-8px)] md:w-[25%] aspect-320/212 flex flex-col justify-center items-center gap-2 border-1 border-white/3 relative z-2 pointer-events-none"
                >
                  <div className="w-22 2xl:w-30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="w-full"
                    />
                  </div>
                  <p
                    className="h-[3em] md:h-auto text-sm leading-[1.5em] md:leading-[2em] font-semibold uppercase text-center"
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
