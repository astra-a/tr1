"use client";

import { Media } from "@/payload-types";
import Item from "./Item";

type GridProps = {
  mediaArray: Media[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
};

const Grid = ({ mediaArray, selectedRows, onRowSelect }: GridProps) => {
  return (
    <div className="flex flex-wrap max-md:-mt-3">
      {mediaArray.map((media) => (
        <Item
          key={media.id}
          media={media}
          selected={selectedRows.includes(media.id)}
          onRowSelect={onRowSelect}
        />
      ))}
    </div>
  );
};

export default Grid;
