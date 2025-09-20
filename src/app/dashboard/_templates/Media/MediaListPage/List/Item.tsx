import { Media } from "@/payload-types";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import TableRow from "@/app/dashboard/_components/TableRow";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import dayjs from "dayjs";
import Image from "@/app/dashboard/_components/Image";
import { filesize } from "filesize";
import { useState } from "react";
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
    <TableRow selectedRows={selected} onRowSelect={() => onRowSelect(media.id)}>
      <td>
        <div
          className="inline-flex items-center"
          onClick={() => setVisible(!visible)}
        >
          <div className="relative z-2 shrink-0">
            {media?.url ? (
              <Image
                className="size-16 rounded-xl opacity-100 object-cover max-md:w-18 max-md:h-18"
                src={media.url}
                width={64}
                height={64}
                alt={media.alt}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="max-w-69 pl-5 max-md:max-w-fit max-md:w-[calc(100%-4rem)] max-md:pl-4">
            <div className="pt-0.5 text-sub-title-1 max-md:pt-0 max-md:line-clamp-1">
              {media.filename}
            </div>
            <div className="relative">
              <div
                className={`absolute top-0 left-0 truncate text-caption text-t-secondary/80 transition-all group-hover:invisible group-hover:opacity-0 max-md:right-0 ${visible ? "max-lg:invisible max-lg:opacity-0" : ""}`}
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
                className={`flex flex-wrap gap-2 mt-0.5 -ml-1 invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100 max-md:mt-2 max-md:-mr-4 max-md:gap-0 ${
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
        </div>
      </td>
      <td className="max-md:hidden">{media.alt}</td>
      <td className="text-t-secondary max-lg:hidden">
        {dayjs(media.updatedAt).format("DD MMM, hh:mm A")}
      </td>
    </TableRow>
  );
};

export default Item;
