"use client";

import { useQuery } from "@tanstack/react-query";
import { Media } from "@/payload-types";
import Image from "next/image";
import { useState } from "react";
import { keepPreviousData } from "@tanstack/query-core";
import Pagination from "@/app/dashboard/_components/Pagination";
import Button from "@/app/dashboard/_components/Button";
import { filesize } from "filesize";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const PAGE_SIZE = 10;

export default function ChooseMediaDialog({
  onClose,
  onSelect,
  showCreateButton,
  switchToCreate,
}: {
  onClose: () => void;
  onSelect: (media: Media) => void;
  showCreateButton?: boolean;
  switchToCreate?: () => void;
}) {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["media", page],
    queryFn: async (): Promise<{
      docs: Media[];
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
      nextPage: number | null;
      page: number;
      pagingCounter: number;
      prevPage: number | null;
      totalDocs: number;
      totalPages: number;
    } | null> => {
      const res = await fetch(`/api/media?limit=${PAGE_SIZE}&page=${page}`);
      if (res.ok) {
        return res.json();
      } else {
        return null;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 3_600_000,
  });

  return (
    <div className="fixed inset-0 z-100 bg-black/36">
      <div className="absolute left-[20vw] top-[10vh] w-[60vw] min-h-[25vh] bg-white rounded-xl p-6">
        <div className="flex justify-between">
          <h2 className="text-3xl font-semibold text-black">Choose a Media</h2>
          <div className="flex items-center gap-4">
            {showCreateButton && (
              <Button
                type="button"
                icon="upload"
                isStroke
                onClick={switchToCreate}
              >
                <span className="ml-2">Create</span>
              </Button>
            )}
            <Button
              type="button"
              icon="close"
              isGray
              isCircle
              onClick={onClose}
            />
          </div>
        </div>
        <div className="mt-4 max-h-[60vh] overflow-auto">
          <table className="w-full text-body-2 [&_th,&_td]:pl-2 [&_th,&_td]:py-2 [&_th,&_td]:first:pl-2 [&_th,&_td]:last:pr-2 [&_th]:align-middle [&_th]:text-left [&_th]:text-caption [&_th]:text-t-tertiary/80 [&_th]:font-normal max-lg:[&_th,&_td]:first:pl-2 max-md:[&_th,&_td]:p-2 max-md:[&_th]:border-b max-md:[&_th]:border-s-subtle">
            <thead className="max-md:hidden">
              <tr>
                <th className="max-lg:nth-5:hidden max-lg:last:hidden">
                  Media
                </th>
                <th className="max-lg:nth-5:hidden max-lg:last:hidden">Alt</th>
                <th className="max-lg:nth-5:hidden max-lg:last:hidden">
                  Last edited (UTC)
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.docs?.map((doc) => (
                <tr
                  key={doc.id}
                  className={`group relative [&_td:not(:first-child)]:relative [&_td]:z-2 [&_td]:border-t [&_td]:border-s-subtle max-md:first:[&_td]:border-t-0`}
                >
                  <td>
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => onSelect(doc)}
                    >
                      <div className="relative z-2 shrink-0">
                        {doc?.url ? (
                          <Image
                            className="size-12 rounded-xl opacity-100 object-cover max-md:w-18 max-md:h-18"
                            src={doc.url}
                            width={64}
                            height={64}
                            alt={doc.alt}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="max-w-69 pl-3 max-md:max-w-fit max-md:w-[calc(100%-4rem)] max-md:pl-2">
                        <div className="text-sub-title-1 max-md:line-clamp-1">
                          {doc.filename}
                        </div>
                        <div className="truncate text-caption text-t-secondary/80">
                          <span>{doc.mimeType}</span>
                          {" | "}
                          <span>
                            {doc.width}×{doc.height}px
                          </span>
                          {" | "}
                          <span>{filesize(doc.filesize || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="max-md:hidden">{doc.alt}</td>
                  <td className="text-t-secondary max-lg:hidden">
                    {dayjs(doc.updatedAt).utc().format("DD MMM, hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          {data?.totalPages && data?.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
