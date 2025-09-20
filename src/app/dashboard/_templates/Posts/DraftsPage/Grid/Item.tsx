"use client";

import { Post } from "@/payload-types";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GridPost from "@/app/dashboard/_components/GridPost";
import dayjs from "dayjs";
import { toast } from "sonner";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

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
    <GridPost
      title={post.title}
      image={post?.coverImage}
      // price={0}
      selectedRows={selected}
      onRowSelect={() => onRowSelect(post.id)}
      key={post.id}
      actions={
        <>
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
        </>
      }
    >
      <div className="flex items-center gap-2 text-caption text-t-secondary/80">
        <Icon className="fill-t-secondary" name="clock" />
        {dayjs(post.updatedAt).format("DD MMM, hh:mm A")}
      </div>
    </GridPost>
  );
};

export default Item;
