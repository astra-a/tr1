"use client";

import { Post } from "@/payload-types";
import Item from "./Item";

type GridProps = {
  posts: Post[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
};

const Grid = ({ posts, selectedRows, onRowSelect }: GridProps) => {
  return (
    <div className="flex flex-wrap max-md:-mt-3">
      {posts.map((post) => (
        <Item
          key={post.id}
          post={post}
          selected={selectedRows.includes(post.id)}
          onRowSelect={onRowSelect}
        />
      ))}
    </div>
  );
};

export default Grid;
