"use client";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Post } from "@/payload-types";

export default function Breadcrumbs({ news }: { news: Pick<Post, "title"> }) {
  return (
    <ol className="breadcrumb flex items-center gap-1">
      <li className="text-sm text-ash-gray">
        <Link
          href="/news"
          className="hover:text-white hover:underline transition"
        >
          News
        </Link>
      </li>
      <li className="text-xs text-ash-gray">
        <FontAwesomeIcon icon={faAngleRight} />
      </li>
      <li className="flex-auto w-0 text-sm text-ash-gray">
        <p className="line-clamp-1">{news.title}</p>
      </li>
    </ol>
  );
}
