import { redirect } from "next/navigation";
import { countMedia, queryMedia } from "@/app/dashboard/_helpers/media";
import MediaListPage from "@/app/dashboard/_templates/Media/MediaListPage";
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

  const where: Where = {};
  if (keywords) {
    where.or = [{ alt: { like: keywords } }, { filename: { like: keywords } }];
  }

  const mediaCount = await countMedia({
    where,
  });
  const mediaArray = await queryMedia({
    where,
    sort: "-updatedAt",
    limit,
    page,
  });

  if (page > 1 && mediaArray.length === 0) {
    return redirect(ROUTES.media(keywords, page - 1));
  }

  return (
    <MediaListPage
      mediaArray={mediaArray}
      mediaCount={mediaCount}
      page={page}
    />
  );
}
