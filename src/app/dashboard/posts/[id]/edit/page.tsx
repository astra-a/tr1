import { notFound } from "next/navigation";
import { queryPostById } from "@/app/dashboard/_helpers/posts";
import {
  getCategoryList,
  queryCategories,
} from "@/app/dashboard/_helpers/categories";
import PostForm from "@/app/dashboard/_templates/Posts/PostForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await queryPostById({ id });
  console.log("post", post);

  if (!post) {
    return notFound();
  }

  // const html = convertLexicalToHTML({ data: post.content });
  // console.log('html', html);

  const rawCategories = await queryCategories({
    sort: ["parent", "createdAt"],
    pagination: false,
  });

  return (
    <PostForm
      post={post}
      categoryList={getCategoryList(rawCategories)}
      pageTitle="Edit post"
    />
  );
}
