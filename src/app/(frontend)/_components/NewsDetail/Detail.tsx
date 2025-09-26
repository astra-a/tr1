"use client";

import { faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Category, Media, Post } from "@/payload-types";
import Image from "next/image";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

export default function NewsDetail({ news }: { news: Post }) {
  return (
    <div className="news-detail-container mt-9 bg-eerie-black rounded-[20px]">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-[6%] xl:px-[10%] 2xl:px-[15%] py-10 sm:py-12 md:py-14 lg:py-16 xl:py-18 2xl:py-20 min-h-100">
        <h3 className="news-title text-xl md:text-2xl xl:text-3xl 2xl:text-4xl leading-[1.4em] text-white font-semibold tracking-[-0.02em]">
          {news.title}
        </h3>

        {/*<div className="news-info-container flex justify-between items-center mt-2">*/}
        {/*  <div className="text-xs text-ash-gray">*/}
        {/*    by <span className="text-bright-aqua">Deothemes</span> -{" "}*/}
        {/*    {dayjs.unix(1516464000).format("MMM. DD, YYYY")}*/}
        {/*  </div>*/}
        {/*  <div className="flex items-center gap-1 text-white">*/}
        {/*    <FontAwesomeIcon icon={faEye} />*/}
        {/*    <p className="text-xs">1500</p>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {news?.coverImage ? (
          <div className="news-cover-image mt-8">
            <Image
              src={(news.coverImage as Media)?.url ?? ""}
              alt={news.title}
              width={978}
              height={550}
              className="w-full"
              priority
            />
          </div>
        ) : (
          <></>
        )}

        {news?.content ? (
          <div
            className="news-content mt-6"
            dangerouslySetInnerHTML={{
              __html: convertLexicalToHTML({ data: news.content }),
            }}
          />
        ) : (
          <></>
        )}

        {news?.category ? (
          <div className="news-tags flex items-center gap-4 mt-6 md:mt-8 lg:mt-10">
            <div className="flex items-center gap-1 text-white">
              <FontAwesomeIcon icon={faTags} />
              <p className="text-xs font-semibold uppercase">tags</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-bright-aqua font-bold tracking-[0.05em] uppercase px-3 py-1 bg-dark-greenish-gray border border-bright-aqua rounded-lg">
                {(news.category as Category).title}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
