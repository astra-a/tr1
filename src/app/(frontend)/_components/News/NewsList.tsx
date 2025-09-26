"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import ReactPaginate from "react-paginate";
import { Media, Post } from "@/payload-types";
import NewMatrix from "../NewMatrix";

function NewsItem({ news }: { news: Post }) {
  return (
    <Link
      href={`/news/${news.id}`}
      className="news-container flex flex-col sm:flex-row bg-eerie-black border-2 border-dark-greenish-gray rounded-xl hover:border-mint-green transition-all ease-in-out duration-200"
    >
      <div className="news-image-container sm:max-w-[40%] md:max-w-100 w-100 aspect-5/3 rounded-s-xl overflow-hidden">
        {news.coverImage ? (
          <Image
            src={(news.coverImage as Media)?.url ?? ""}
            alt={news.title}
            width={697}
            height={420}
            className="aspect-5/3"
            priority
          />
        ) : (
          <></>
        )}
      </div>

      <div className="news-info-container relative flex flex-col sm:flex-auto sm:w-0 justify-between gap-1.5 md:gap-3 p-3 pb-5 md:p-8 rounded-e-inherit">
        <NewMatrix className="absolute inset-0 z-0 overflow-hidden rounded-inherit bg-eerie-black" />

        <h2 className="news-title z-1 text-base sm:text-lg lg:text-xl xl:text-2xl md:text-3xl 2xl:text-[2rem] tracking-[-0.02em] font-semibold text-white transition-all ease-in-out duration-200 pointer-events-none">
          {news.title}
        </h2>
        <div className="flex z-1 flex-col gap-2 pointer-events-none">
          {/*<div className="text-[0.625rem] md:text-xs text-ash-gray">*/}
          {/*  by <span className="text-bright-aqua">{item.author}</span> -{" "}*/}
          {/*  {dayjs.unix(item.datetime).format("MMM. DD, YYYY")}*/}
          {/*</div>*/}
          <div className="text-xs md:text-sm xl:text-base text-white/80">
            <p className="line-clamp-1">{news.description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function NewsList({
  postCount,
  pageSize,
  pageIndex,
  posts,
}: {
  postCount: number;
  pageSize: number;
  pageIndex: number;
  posts: Post[];
}) {
  const router = useRouter();

  const pageCount = useMemo(
    () => Math.ceil(postCount / pageSize),
    [postCount, pageSize],
  );

  return (
    <div className="news-list flex flex-col mt-10 relative z-[2]">
      <div className="flex flex-col gap-4">
        {posts.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            viewport={{ once: true, margin: "150px" }}
          >
            <NewsItem news={item} />
          </motion.div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="pagination flex justify-end mt-6 md:mt-9">
          <ReactPaginate
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            pageCount={pageCount}
            initialPage={pageIndex - 1}
            pageRangeDisplayed={3}
            marginPagesDisplayed={3}
            onPageChange={(p) => {
              router.push(`/news?page=${p.selected + 1}`, { scroll: false });
            }}
          />
        </div>
      )}
    </div>
  );
}
