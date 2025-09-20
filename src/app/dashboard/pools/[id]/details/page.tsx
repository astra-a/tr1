import DetailsPage from "@/app/dashboard/_templates/Pools/DetailsPage";
import { notFound } from "next/navigation";
import { queryPoolById } from "@/app/dashboard/_helpers/pools";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pool = await queryPoolById({ id });
  // console.log("pool", pool);

  if (!pool) {
    return notFound();
  }

  return <DetailsPage pool={pool} />;
}
