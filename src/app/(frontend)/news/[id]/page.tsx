import { notFound } from "next/navigation";
import { queryPostById } from "@/app/dashboard/_helpers/posts";
import Breadcrumbs from "../../_components/NewsDetail/Breadcrumbs";
import NewsDetail from "../../_components/NewsDetail/Detail";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await queryPostById({ id });
  if (!news) {
    return notFound();
  }

  return (
    <div className="news-detail w-full max-w-370 mx-auto p-5 sm:p-6 md:p-7 lg:p-8 xl:p-9 2xl:p-10 pt-3 md:pt-4 xl:pt-5 2xl:pt-6 relative overflow-hidden antialiased">
      <Breadcrumbs news={news} />
      <NewsDetail news={news} />
    </div>
  );
}
