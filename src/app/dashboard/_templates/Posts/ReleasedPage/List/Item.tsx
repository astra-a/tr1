"use client";

import { Post } from "@/payload-types";
import { POST_STATUS } from "@/constants";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import UnpublishItems from "@/app/dashboard/_components/UnpublishItems";
import UnpinItems from "@/app/dashboard/_components/UnpinItems";
import PinItems from "@/app/dashboard/_components/PinItems";
import TableRow from "@/app/dashboard/_components/TableRow";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import TablePostCell from "../../TablePostCell";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

dayjs.extend(utc);

const Item = ({
  post,
  selected,
  onRowSelect,
}: {
  post: Post;
  selected?: boolean;
  onRowSelect: (id: string | number) => void;
}) => {
  const router = useRouter();

  const operatePostMutation = useMutation({
    mutationFn: async (
      operate: "pin" | "unpin" | "unpublish" | "delete",
    ): Promise<{
      ok: boolean;
      message: string;
      data: { id: string };
    }> => {
      return axiosInstance.post(ROUTES.posts_operate_action(post.id, operate));
    },
  });
  const handleOperate = async (
    operate: "pin" | "unpin" | "unpublish" | "delete",
  ) => {
    try {
      const resp = await operatePostMutation.mutateAsync(operate);
      console.log(`handle.${operate}.resp`, resp);
      toast.success(resp.message);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <TableRow selectedRows={selected} onRowSelect={() => onRowSelect(post.id)}>
      <TablePostCell title={post.title} details={""} image={post?.coverImage}>
        <Link className="action" href={ROUTES.posts_edit(post.id)}>
          <Icon name="edit" />
          Edit
        </Link>
        <DeleteItems onDelete={() => handleOperate("delete")} />
        <UnpublishItems
          onClick={() => handleOperate("unpublish")}
          image={post?.coverImage}
        />
        {post.isPin ? (
          <UnpinItems
            onClick={() => handleOperate("unpin")}
            image={post?.coverImage}
          />
        ) : (
          <PinItems
            onClick={() => handleOperate("pin")}
            image={post?.coverImage}
          />
        )}
      </TablePostCell>
      <td className="max-md:hidden">
        {!!post.category && "string" !== typeof post.category ? (
          post.category.title
        ) : (
          <span className="text-t-secondary">&lt;No Category&gt;</span>
        )}
      </td>
      <td className="max-md:hidden">
        <div
          className={`label capitalize ${
            POST_STATUS.Published === post.status ? "label-green" : "label-red"
          }`}
        >
          {POST_STATUS.Published === post.status ? "Active" : "Offline"}
        </div>
      </td>
      <td className="max-md:hidden">
        <div
          className={`label capitalize ${post.isPin ? "label-green" : "label-red"}`}
        >
          {post.isPin ? "Yes" : "No"}
        </div>
      </td>
      {/*<td className="max-lg:hidden">*/}
      {/*  <div className="inline-flex items-center">*/}
      {/*    <Icon*/}
      {/*      className="mr-2 !size-5 fill-t-secondary transition-colors group-hover:fill-chart-yellow"*/}
      {/*      name="star-fill"*/}
      {/*    />*/}
      {/*    <div className="mr-1">{0}</div>*/}
      {/*    <div className="text-t-secondary">({0})</div>*/}
      {/*  </div>*/}
      {/*</td>*/}
      {/*<td className="max-lg:hidden">*/}
      {/*  <div className="inline-flex items-center gap-2">*/}
      {/*    <div className="min-w-8">*/}
      {/*      {millify(0, {*/}
      {/*        lowercase: true,*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*    <div className="relative w-8 h-1.5 rounded-[2px] bg-shade-07/40">*/}
      {/*      <div*/}
      {/*        className="absolute top-0 left-0 bottom-0 rounded-[2px] bg-chart-green"*/}
      {/*        style={{*/}
      {/*          width: `${0}%`,*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</td>*/}
      <td className="text-t-secondary max-lg:hidden">
        {dayjs(post.publishedAt).utc().format("DD MMM, hh:mm A")}
      </td>
    </TableRow>
  );
};

export default Item;
