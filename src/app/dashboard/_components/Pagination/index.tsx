"use client";

import Button from "@/app/dashboard/_components/Button";

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2">
      <Button
        className="rotate-180"
        icon="arrow"
        isCircle
        isStroke
        disabled={1 >= currentPage}
        onClick={() => onPageChange(currentPage - 1)}
      />
      <Button
        icon="arrow"
        isCircle
        isStroke
        disabled={pageCount <= currentPage}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </div>
  );
}
