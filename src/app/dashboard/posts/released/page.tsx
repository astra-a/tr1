import { redirect } from "next/navigation";
import ReleasedPage from "@/app/dashboard/_templates/Posts/ReleasedPage";
import { POST_STATUS } from "@/constants";
import { countPosts, queryPosts } from "@/app/dashboard/_helpers/posts";
import { Where } from "payload";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ keywords?: string; limit?: string; page?: string }>;
}) {
  const _searchParams = await searchParams;
  const keywords = _searchParams.keywords;
  const limit = parseInt(_searchParams.limit ?? "10", 10);
  const page = parseInt(_searchParams.page ?? "1", 10);

  const where: Where = { status: { equals: POST_STATUS.Published } };
  if (keywords) {
    where["title"] = { like: keywords };
  }

  const postCount = await countPosts({
    where,
  });
  const posts = await queryPosts({
    where,
    sort: ["-isPin", "-publishedAt"],
    limit,
    page,
  });
  // console.log("postCount", postCount);
  // console.log("posts", posts.map((p) => p.title));
  // console.log("posts.0", posts?.[0]);

  if (page > 1 && posts.length === 0) {
    return redirect(ROUTES.posts_released(keywords, page - 1));
  }

  return <ReleasedPage posts={posts} postCount={postCount} page={page} />;
}
