"use client";

import TableRow from "@/app/dashboard/_components/TableRow";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import { Post } from "@/payload-types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
      operate: "publish" | "delete",
    ): Promise<{
      ok: boolean;
      message: string;
      data: { id: string };
    }> => {
      return axiosInstance.post(ROUTES.posts_operate_action(post.id, operate));
    },
  });
  const handleOperate = async (operate: "publish" | "delete") => {
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
      <TablePostCell
        title={post.title}
        details={""}
        image={post?.coverImage}
        mobileContent={
          <div className="flex items-center gap-2 text-t-secondary/80">
            <Icon className="!size-4 fill-t-secondary" name="clock-1" />
            {dayjs(post.updatedAt).utc().format("DD MMM, hh:mm A")}
          </div>
        }
      >
        <Link className="action" href={ROUTES.posts_edit(post.id)}>
          <Icon name="edit" />
          Edit
        </Link>
        <DeleteItems onDelete={() => handleOperate("delete")} />
        <button className="action" onClick={() => handleOperate("publish")}>
          <Icon name="check" />
          Publish
        </button>
        {/*<SchedulePost*/}
        {/*  title={post.title}*/}
        {/*  details={post.category}*/}
        {/*  image={post.image}*/}
        {/*  price={post.price}*/}
        {/*/>*/}
      </TablePostCell>
      <td className="max-md:hidden">
        {!!post.category && "string" !== typeof post.category ? (
          post.category.title
        ) : (
          <span className="text-t-secondary">&lt;No Category&gt;</span>
        )}
      </td>
      {/*<td className="max-md:hidden">*/}
      {/*  <div*/}
      {/*    className={`label ${*/}
      {/*      post.price === 0 ? "label-gray text-t-primary" : "label-green"*/}
      {/*    }`}*/}
      {/*  >*/}
      {/*    ${post.price}*/}
      {/*  </div>*/}
      {/*</td>*/}
      <td className="text-t-secondary max-lg:hidden">
        {dayjs(post.updatedAt).utc().format("DD MMM, hh:mm A")}
      </td>
    </TableRow>
  );
};

export default Item;
