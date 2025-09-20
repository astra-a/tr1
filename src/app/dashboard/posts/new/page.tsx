import { Post } from "@/payload-types";
import PostForm from "@/app/dashboard/_templates/Posts/PostForm";
import { POST_STATUS } from "@/constants";
import {
  getCategoryList,
  queryCategories,
} from "@/app/dashboard/_helpers/categories";

export default async function Page() {
  const post: Post = {
    id: "",
    title: "",
    description: "",
    category: null,
    coverImage: null,
    content: null,
    slug: null,
    slugLock: null,
    status: POST_STATUS.Draft,
    createdAt: "",
    updatedAt: "",
  };

  const rawCategories = await queryCategories({
    sort: ["parent", "createdAt"],
    pagination: false,
  });

  return (
    <PostForm
      post={post}
      categoryList={getCategoryList(rawCategories)}
      pageTitle="New Post"
    />
  );
}
