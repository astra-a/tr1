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
    <div className="news-detail w-full max-w-370 mx-auto p-10 pt-6 relative overflow-hidden antialiased">
      <Breadcrumbs news={news} />
      <NewsDetail news={news} />
    </div>
  );
}
