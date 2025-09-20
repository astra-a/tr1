"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function SectionHeader({
  image,
  tag,
  title,
  description,
}: {
  image: string;
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="section-header flex flex-col items-center gap-4 md:gap-4.5 lg:gap-5 xl:gap-5.5 2xl:gap-6"
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      viewport={{ amount: "some" }}
    >
      <div className="section-tag flex items-center justify-center gap-1 bg-[#181B25] rounded-lg px-2 py-1">
        <Image
          src={image}
          alt=""
          width={20}
          height={20}
          className="size-4 lg:size-5"
        />
        <p className="text-lg md:text-xl xl:text-2xl leading-[1.25em] text-white">
          {tag}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl md:text-[1.75rem] lg:text-3xl xl:text-4xl 2xl:text-5xl leading-[1.16667em] tracking-[-0.03em] text-white-gradient text-center">
          {title}
        </h2>
        <p
          className="text-xs md:text-sm xl:text-base text-aquaGreen-skyblue-gradient text-center"
          data-text={description}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
