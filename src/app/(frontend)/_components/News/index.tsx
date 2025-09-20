"use client";

import { useState } from "react";
import { Post } from "@/payload-types";
import NewsFlash from "./NewsFlash";
import TopNews from "./TopNews";
import NewsList from "./NewsList";

export default function News({
  postCount,
  pageSize,
  pageIndex,
  pinnedPosts,
  remainingPosts,
}: {
  postCount: number;
  pageSize: number;
  pageIndex: number;
  pinnedPosts: Post[];
  remainingPosts: Post[];
}) {
  const [lastCompleted, setLastCompleted] = useState(false); // Is the last animation of the first screen completed?

  return (
    <div className="news w-full max-w-370 min-h-100 mx-auto p-4 sm:p-6 md:p-7 lg:p-8 xl:p-9 2xl:p-10 relative overflow-hidden antialiased">
      <NewsFlash />
      <TopNews pinnedPosts={pinnedPosts} setLastCompleted={setLastCompleted} />
      <NewsList
        postCount={postCount}
        pageSize={pageSize}
        pageIndex={pageIndex}
        posts={remainingPosts}
        lastCompleted={lastCompleted}
      />
    </div>
  );
}
