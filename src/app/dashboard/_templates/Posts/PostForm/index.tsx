"use client";

import Layout from "@/app/dashboard/_components/Layout";
import Images from "./Images";
import CategoryAndAttributes from "./CategoryAndAttributes";
import Discussion from "./Discussion";
import CoverImage from "./CoverImage";
import UploadPostFiles from "./UploadPostFiles";
import Price from "./Price";
import Highlights from "./Highlights";
import CTA from "./CTA";
import Demos from "./Demos";
import { Post } from "@/payload-types";
import Button from "@/app/dashboard/_components/Button";
import { useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "@/app/dashboard/_components/Card";
import FieldContainer from "@/app/dashboard/_components/FieldContainer";
import RichTextEditor from "@/app/dashboard/_components/RichTextEditor";
import InputField from "@/app/dashboard/_components/Fields/Input";
import SelectField from "@/app/dashboard/_components/Fields/Select";
import TextareaField from "@/app/dashboard/_components/Fields/Textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import axiosInstance from "@/app/dashboard/_helpers/axios";
import { useMutation } from "@tanstack/react-query";

const PostForm = ({
  post,
  pageTitle,
  categoryList,
}: {
  post: Post;
  categoryList: { id: string; name: string }[];
  pageTitle?: string;
}) => {
  const router = useRouter();

  const initialContent = useMemo(
    () => (post?.content ? JSON.stringify(post.content) : undefined),
    [post?.content],
  );

  // --- mutation:
  const createPostMutation = useMutation({
    mutationFn: async (
      data: any,
    ): Promise<{ ok: boolean; message: string; data: { id: string } }> => {
      return axiosInstance.post(ROUTES.posts_new_action, data);
    },
  });
  const updatePostMutation = useMutation({
    mutationFn: async (
      data: any,
    ): Promise<{ ok: boolean; message: string; data: { id: string } }> => {
      return axiosInstance.post(ROUTES.posts_edit_action(post.id), data);
    },
  });

  // --- form validate

  const schema = z.object({
    title: z.string().min(1, { message: "Title can't be empty" }),
    description: z.string(),
    category: z.nullish(z.object({ id: z.string(), name: z.string() })),
    content: z.string(),
    coverImage: z.string().min(1, { message: "Cover image can't be empty" }),
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
      title: post.title,
      description: post.description ?? "",
      category:
        !!post?.category && "string" !== typeof post.category
          ? { id: post.category.id, name: post.category.title }
          : null,
      content: post?.content ? JSON.stringify(post.content) : "",
      coverImage:
        !!post?.coverImage && "string" !== typeof post.coverImage
          ? post.coverImage.id
          : "",
    },
  });
  const onSubmit = async (data: {
    title: string;
    description: string;
    category?: { id: string; name: string } | null;
    content: string;
    coverImage: string;
  }) => {
    console.log("onSubmit.data", data);
    const postData = {
      title: data.title,
      description: data.description,
      category: data.category ? data.category.id : "",
      content: data.content, // todo: json
      coverImage: data.coverImage,
    };
    try {
      const resp = await (
        post.id ? updatePostMutation : createPostMutation
      ).mutateAsync(postData);
      console.log("resp", resp);
      toast.success(resp.message);
      router.push(ROUTES.posts_edit(resp.data.id));
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <Layout title={pageTitle} customHeaderActions={<></>}>
      <form id="post-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex max-lg:block">
          <div className="w-[calc(100%-33.75rem)] pr-3 max-4xl:w-[calc(100%-27.5rem)] max-2xl:w-[calc(100%-23rem)] max-lg:w-full max-lg:pr-0">
            <Card title="Post Details">
              <div className="flex flex-col gap-8 px-5 pb-5 max-lg:px-3 max-lg:pb-3">
                <InputField
                  label="Post Title"
                  tooltip="Maximum 100 characters. No HTML or emoji allowed"
                  placeholder="ie. Bento Cards: User Interface"
                  {...register("title")}
                  errorMessage={errors?.title?.message}
                />
                <TextareaField
                  label="Description"
                  placeholder=""
                  autoFocus={false}
                  {...register("description")}
                  errorMessage={errors?.description?.message}
                />
                <SelectField
                  label="Category"
                  tooltip="Maximum 100 characters. No HTML or emoji allowed"
                  placeholder="Select a value"
                  value={getValues("category")}
                  onChange={(val) => {
                    setValue("category", val);
                    trigger?.("category");
                  }}
                  options={categoryList}
                  errorMessage={errors?.category?.message}
                />
                <FieldContainer label="Content">
                  <input type="hidden" {...register("content")} />
                  <RichTextEditor
                    initialJsonString={initialContent}
                    onChange={(val) => {
                      setValue("content", val);
                      // trigger?.("content");
                    }}
                  />
                </FieldContainer>
              </div>
            </Card>
            {/*<Images />*/}
            {/*<CategoryAndAttributes />*/}
            {/*<Discussion />*/}
          </div>
          <div className="w-[33.75rem] max-4xl:w-[27.5rem] max-2xl:w-[23rem] max-lg:w-full max-lg:mt-3">
            <CoverImage
              post={post}
              type="hidden"
              onUpload={(val) => {
                setValue("coverImage", val);
                trigger?.("coverImage");
              }}
              {...register("coverImage")}
              errorMessage={errors?.coverImage?.message}
            />
            {/*<UploadPostFiles />*/}
            {/*<Price />*/}
            {/*<Highlights />*/}
            {/*<CTA />*/}
            {/*<Demos />*/}
            <Button
              className="max-md:w-[calc(50%-0.75rem)] max-md:mx-1.5 mb-2 w-full"
              isWhite
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default PostForm;
