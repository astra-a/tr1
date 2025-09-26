"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Category, Post, Media } from "@/payload-types";
import NewMatrix from "../NewMatrix";

export default function TopNews({ pinnedPosts }: { pinnedPosts: Post[] }) {
  return (
    <div className="top-news flex flex-col-reverse lg:flex-row gap-4 sm:gap-6 md:gap-2 mt-4 md:mt-5 lg:mt-6 xl:mt-7 relative z-[1]">
      <div className="top-news-left lg:w-[50%] flex flex-col gap-2">
        {pinnedPosts.map((item, i) => {
          if (0 === i) return;
          const infoAtLeft = i % 2 === 1;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              viewport={{ once: true, margin: "150px" }}
            >
              <Link
                href={`/news/${item.id}`}
                className={`news-container flex flex-col-reverse ${infoAtLeft ? "sm:flex-row" : "sm:flex-row-reverse"} border-gradient-rounded vertical hover rounded-xl`}
              >
                <div
                  className={`news-info-container relative w-full flex flex-col flex-auto justify-center gap-0.5 sm:gap-1 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4 p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8 2xl:p-9 max-sm:rounded-b-xl ${infoAtLeft ? "sm:rounded-s-xl" : "sm:rounded-e-xl"}`}
                >
                  <NewMatrix className="absolute inset-0 z-0 overflow-hidden rounded-inherit bg-jet-black" />

                  <h3 className="news-title text-base xl:text-lg font-semibold text-white line-clamp-4 z-[1] pointer-events-none">
                    {item.title}
                  </h3>
                  <div className="text-xs md:text-sm xl:text-base text-ash-gray z-[1] pointer-events-none">
                    <p className="line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <div
                  className={`news-image-container relative w-full sm:w-[40%] lg:w-[50%] aspect-5/3 shrink-0 bg-jet-black max-sm:rounded-t-xl ${infoAtLeft ? "sm:rounded-e-xl" : "sm:rounded-s-xl"} overflow-hidden`}
                >
                  <Image
                    src={(item.coverImage as Media)?.url ?? ""}
                    alt={item.title}
                    width={697}
                    height={420}
                    className="w-full h-full object-cover"
                    priority
                  />
                  {item?.category ? (
                    <div
                      className="text-[0.625rem] md:text-xs text-jet-black font-bold uppercase absolute
                   left-2 sm:left-2.5 md:left-3 lg:left-4 xl:left-4.5 2xl:left-5
                   bottom-2 sm:bottom-2.5 md:bottom-3 lg:bottom-4 xl:bottom-4.5 2xl:bottom-5
                   px-2 md:px-2.5 xl:px-3 2xl:px-3.5
                   py-0.5 md:0.75 lg:py-1 xl:py-1.25 2xl:py-1.5
                   bg-mint-green rounded-md"
                    >
                      {(item.category as Category).title}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {pinnedPosts.length > 0 && (
        <motion.div
          className="top-news-right lg:w-[50%] flex flex-auto"
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true, margin: "150px" }}
        >
          <Link
            href={`/news/${pinnedPosts[0].id}`}
            className="news-container horizontal flex flex-col flex-auto border-gradient-rounded hover rounded-xl"
          >
            <div className="news-image-container relative w-full aspect-5/3 bg-jet-black rounded-t-xl overflow-hidden">
              {pinnedPosts[0]?.coverImage ? (
                <Image
                  src={(pinnedPosts[0].coverImage as Media)?.url ?? ""}
                  alt={pinnedPosts[0].title}
                  width={697}
                  height={420}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <></>
              )}
              {pinnedPosts[0]?.category ? (
                <div
                  className="text-[0.625rem] md:text-xs text-jet-black font-bold uppercase absolute
                   left-2 sm:left-2.5 md:left-3 lg:left-4 xl:left-4.5 2xl:left-5
                   bottom-2 sm:bottom-2.5 md:bottom-3 lg:bottom-4 xl:bottom-4.5 2xl:bottom-5
                   px-2 md:px-2.5 xl:px-3 2xl:px-3.5
                   py-0.5 md:0.75 lg:py-1 xl:py-1.25 2xl:py-1.5
                   bg-mint-green rounded-md"
                >
                  {(pinnedPosts[0]?.category as Category).title}
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="news-info-container relative flex flex-col flex-auto justify-between gap-0.5 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8 2xl:p-9 md:pt-4.5 lg:pt-5 xl:pt-6 2xl:pt-7 rounded-b-xl">
              <NewMatrix className="absolute inset-0 z-0 overflow-hidden rounded-inherit bg-jet-black" />

              <h2 className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-[2rem] tracking-[-0.02em] font-semibold text-white line-clamp-3 z-[1] pointer-events-none">
                {pinnedPosts[0].title}
              </h2>
              <div className="text-xs md:text-sm xl:text-base text-ash-gray z-[1] pointer-events-none">
                <p className="line-clamp-1">{pinnedPosts[0].description}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
