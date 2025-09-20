"use client";

import { Media } from "@/payload-types";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import Checkbox from "@/app/dashboard/_components/Checkbox";
import Image from "@/app/dashboard/_components/Image";
import { filesize } from "filesize";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

const Item = ({
  media,
  selected,
  onRowSelect,
}: {
  media: Media;
  selected?: boolean;
  onRowSelect: (id: string | number) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const deleteMediaMutation = useMutation({
    mutationFn: async (): Promise<{
      ok: boolean;
      message: string;
      data: { id: string };
    }> => {
      return axiosInstance.post(ROUTES.media_delete_action(media.id));
    },
  });
  const handleDelete = async () => {
    try {
      const resp = await deleteMediaMutation.mutateAsync();
      console.log(`handle.delete.resp`, resp);
      toast.success(resp.message);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <div
      className="group w-[calc(20%-1.5rem)] mt-6 mx-3 max-4xl:w-[calc(25%-1.5rem)] max-[1539px]:w-[calc(33.333%-1.5rem)] max-lg:w-[calc(50%-1.5rem)] max-md:w-[calc(100%-1.5rem)]"
      onClick={() => setVisible(!visible)}
    >
      <div className="relative h-57.5">
        {onRowSelect && (
          <Checkbox
            className={`absolute top-4 left-4 z-5 invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100 max-md:hidden data-[checked]:!visible data-[checked]:!opacity-100 ${
              visible ? "max-lg:visible max-lg:opacity-100" : ""
            }`}
            classTick="bg-b-surface2"
            checked={selected ?? false}
            onChange={() => onRowSelect(media.id)}
          />
        )}
        {media?.url ? (
          <Image
            className="object-cover opacity-100 rounded-3xl"
            src={media.url}
            alt={media.alt}
            fill
            sizes="(max-width: 767px) 100vw, 280px"
          />
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-start mt-3">
        <div className="grow text-sub-title-1">{media.filename}</div>
      </div>
      <div className="flex items-start">
        <div className="grow text-t-secondary/80">{media.alt}</div>
      </div>
      <div className="relative min-h-6 mt-1">
        <div
          className={`absolute top-0 left-0 truncate text-caption text-t-secondary/80 transition-all group-hover:invisible group-hover:opacity-0 ${visible ? "max-lg:invisible max-lg:opacity-0" : ""}`}
        >
          <span>{media.mimeType}</span>
          {" | "}
          <span>
            {media.width}×{media.height}px
          </span>
          {" | "}
          <span>{filesize(media.filesize || 0)}</span>
        </div>
        <div
          className={`flex flex-wrap gap-2 mt-0.5 -ml-1 invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100 ${
            visible ? "max-lg:visible max-lg:opacity-100" : ""
          }`}
        >
          <Link className="action" href={ROUTES.media_edit(media.id)}>
            <Icon name="edit" />
            Edit
          </Link>
          <DeleteItems onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default Item;
