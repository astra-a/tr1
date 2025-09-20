"use client";

import Layout from "@/app/dashboard/_components/Layout";
import { Category } from "@/payload-types";
import Button from "@/app/dashboard/_components/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "@/app/dashboard/_components/Card";
import InputField from "@/app/dashboard/_components/Fields/Input";
import SelectField from "@/app/dashboard/_components/Fields/Select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

const CategoryForm = ({
  category,
  categoryList,
  pageTitle,
}: {
  category: Category;
  categoryList: { id: string; name: string }[];
  pageTitle?: string;
}) => {
  const router = useRouter();

  // --- mutation:
  const createCategoryMutation = useMutation({
    mutationFn: async (
      data: any,
    ): Promise<{ ok: boolean; message: string; data: { id: string } }> => {
      return axiosInstance.post(ROUTES.categories_new_action, data);
    },
  });
  const updateCategoryMutation = useMutation({
    mutationFn: async (
      data: any,
    ): Promise<{ ok: boolean; message: string; data: { id: string } }> => {
      return axiosInstance.post(
        ROUTES.categories_edit_action(category.id),
        data,
      );
    },
  });

  // --- form validate

  const schema = z.object({
    title: z.string().min(1, { message: "Title can't be empty" }),
    parent: z.nullish(z.object({ id: z.string(), name: z.string() })),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: category.title,
      parent:
        !!category?.parent && "string" !== typeof category.parent
          ? { id: category.parent.id, name: category.parent.title }
          : null,
    },
  });
  const onSubmit = async (data: {
    title: string;
    parent?: { id: string; name: string } | null;
  }) => {
    console.log("onSubmit.data", data);
    const postData = {
      title: data.title,
      parent: data.parent ? data.parent.id : "",
    };
    try {
      const resp = await (
        category.id ? updateCategoryMutation : createCategoryMutation
      ).mutateAsync(postData);
      console.log("resp", resp);
      toast.success(resp.message);
      router.push(ROUTES.categories_edit(resp.data.id));
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <Layout title={pageTitle} customHeaderActions={<></>}>
      <form id="category-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex max-lg:block">
          <div className="w-[calc(100%-33.75rem)] pr-3 max-4xl:w-[calc(100%-27.5rem)] max-2xl:w-[calc(100%-23rem)] max-lg:w-full max-lg:pr-0">
            <Card title="Category Details">
              <div className="flex flex-col gap-8 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <InputField
                  label="title"
                  tooltip="Maximum 100 characters. No HTML or emoji allowed"
                  placeholder="ie. Bento Cards: User Interface"
                  {...register("title")}
                  errorMessage={errors?.title?.message}
                />
                <SelectField
                  label="Parent"
                  tooltip="Maximum 100 characters. No HTML or emoji allowed"
                  placeholder="Select a value"
                  value={getValues("parent")}
                  onChange={(val) => {
                    setValue("parent", val);
                    trigger?.("parent");
                  }}
                  options={categoryList}
                  errorMessage={errors?.parent?.message}
                />
              </div>
            </Card>
            <Button
              className="max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2 w-full"
              isWhite
              type="submit"
            >
              Save
            </Button>
          </div>
          <div className="w-[33.75rem] max-4xl:w-[27.5rem] max-2xl:w-[23rem] max-lg:w-full max-lg:mt-3" />
        </div>
      </form>
    </Layout>
  );
};

export default CategoryForm;
