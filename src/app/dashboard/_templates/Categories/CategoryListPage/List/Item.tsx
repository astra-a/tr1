"use client";

import TableRow from "@/app/dashboard/_components/TableRow";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import { Category } from "@/payload-types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TableCategoryCell from "../TableCategoryCell";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

dayjs.extend(utc);

const Item = ({
  category,
  selected,
  onRowSelect,
}: {
  category: Category;
  selected?: boolean;
  onRowSelect: (id: string | number) => void;
}) => {
  const router = useRouter();

  const deleteCategoryMutation = useMutation({
    mutationFn: async (): Promise<{
      ok: boolean;
      message: string;
      data: { id: string };
    }> => {
      return axiosInstance.post(ROUTES.categories_delete_action(category.id));
    },
  });
  const handleDelete = async () => {
    try {
      const resp = await deleteCategoryMutation.mutateAsync();
      console.log(`handle.delete.resp`, resp);
      toast.success(resp.message);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <TableRow
      selectedRows={selected}
      onRowSelect={() => onRowSelect(category.id)}
    >
      <TableCategoryCell
        title={category.title}
        details={""}
        mobileContent={
          <div className="flex items-center gap-2 text-t-secondary/80">
            <Icon className="!size-4 fill-t-secondary" name="clock-1" />
            {dayjs(category.updatedAt).utc().format("DD MMM, hh:mm A")}
          </div>
        }
      >
        <Link className="action" href={ROUTES.categories_edit(category.id)}>
          <Icon name="edit" />
          Edit
        </Link>
        <DeleteItems
          content={`This will definitely delete this category, and all data will be removed. This action cannot be undone.`}
          onDelete={handleDelete}
        />
      </TableCategoryCell>
      <td className="max-md:hidden">
        {!!category?.parent && "string" !== typeof category.parent ? (
          category.parent.title
        ) : (
          <span className="text-t-secondary">&lt;No Parent&gt;</span>
        )}
      </td>
      <td className="text-t-secondary max-lg:hidden">
        {dayjs(category.updatedAt).utc().format("DD MMM, hh:mm A")}
      </td>
    </TableRow>
  );
};

export default Item;
