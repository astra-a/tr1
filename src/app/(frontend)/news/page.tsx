import { Where } from "payload";
import { POST_STATUS } from "@/constants";
import { countPosts, queryPosts } from "@/app/dashboard/_helpers/posts";
import News from "../_components/News";

export const revalidate = 0;

const LIMIT = 4;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const _searchParams = await searchParams;
  const page = parseInt(_searchParams.page ?? "1", 10);

  const where: Where = { status: { equals: POST_STATUS.Published } };

  const postCount = await countPosts({
    where,
  });

  const pinnedPosts = await queryPosts({
    where,
    sort: ["-isPin", "-publishedAt"],
    limit: LIMIT,
    page: 1,
  });

  const remainingPosts = await queryPosts({
    where,
    sort: ["-isPin", "-publishedAt"],
    limit: LIMIT,
    page: page + 1,
  });

  // pinnedPosts.forEach((post) => {
  //   console.log("post", post.isPin, post.publishedAt, post.title);
  // });
  // remainingPosts.forEach((post) => {
  //   console.log("post", post.isPin, post.publishedAt, post.title);
  // });

  return (
    <News
      postCount={postCount - LIMIT}
      pageSize={LIMIT}
      pageIndex={page}
      pinnedPosts={pinnedPosts}
      remainingPosts={remainingPosts}
    />
  );
}
