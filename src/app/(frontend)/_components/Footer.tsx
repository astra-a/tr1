"use client";

import Image from "next/image";

export default function Footer({ small }: { small?: boolean }) {
  return (
    <div
      className={`footer w-full flex justify-center relative z-30 bg-jet-black ${small ? "pt-6 sm:pt-7 md:pt-8 lg:pt-9 xl:pt-10 2xl:pt-12 pb-12 md:pb-16 lg:pb-20 xl:pb-24 2xl:pb-28 3xl:pb-30" : "py-6 md:py-7 lg:py-8 xl:py-9 2xl:py-10"}`}
    >
      <div
        className={`footer-container flex flex-col items-center w-full max-w-[1920px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-28 3xl:px-35 relative ${small ? "gap-5 md:gap-6 lg:gap-7 xl:gap-8" : "gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4"}`}
      >
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 w-full">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="text-3xl text-white font-semibold text-center sm:text-left">
              <Image
                src="/images/logo-full.png"
                alt="AIOS"
                width={192}
                height={73}
                className="w-auto h-8 xl:h-10 2xl:h-12"
              />
            </div>
            <p className="text-xs md:text-sm xl:text-base text-cool-gray">
              Decentralized AI Infrastructure for Global Scale
            </p>
          </div>
          <div>
            <a className="" href="" target="_blank" rel="noopener noreferrer">
              <Image
                src="/images/icon-twitter.svg"
                alt="Twitter"
                width={20}
                height={20}
                className="size-4 lg:size-5"
              />
            </a>
          </div>
        </div>

        <div className="w-full max-w-410 h-0.25 line-ray" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <p className="text-xs md:text-sm text-slate-gray">
            ©️ 2025 All Rights Reserved
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12 2xl:gap-14 3xl:gap-16">
            <div
              className="text-xs md:text-sm text-slate-gray"
              // className="text-xs md:text-sm text-slate-gray hover:text-white hover:underline transition"
              // href=""
              // target="_blank"
              // rel="noopener noreferrer"
            >
              Privacy Policy
            </div>
            <div
              className="text-xs md:text-sm text-slate-gray"
              // className="text-xs md:text-sm text-slate-gray hover:text-white hover:underline transition"
              // href=""
              // target="_blank"
              // rel="noopener noreferrer"
            >
              Terms & Condition
            </div>
            <div
              className="text-xs md:text-sm text-slate-gray"
              // className="text-xs md:text-sm text-slate-gray hover:text-white hover:underline transition"
              // href=""
              // target="_blank"
              // rel="noopener noreferrer"
            >
              Security Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
