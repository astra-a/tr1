"use client";

import { Post } from "@/payload-types";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import UnpublishItems from "@/app/dashboard/_components/UnpublishItems";
import UnpinItems from "@/app/dashboard/_components/UnpinItems";
import PinItems from "@/app/dashboard/_components/PinItems";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GridPost from "@/app/dashboard/_components/GridPost";
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
        </>
      }
    >
      <div className="flex items-center">
        <div className="max-md:hidden text-sm">
          <Icon
            className="mr-2 !size-5 fill-t-secondary transition-colors group-hover:fill-chart-yellow"
            name="mailchimp"
          />
          {!!post.category && "string" !== typeof post.category ? (
            post.category.title
          ) : (
            <span className="text-t-secondary">&lt;No Category&gt;</span>
          )}
        </div>
      </div>
    </GridPost>
  );
};

export default Item;
