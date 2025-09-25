import { notFound } from "next/navigation";
import BuyAndStake from "../../_components/LaunchpadBuy";
import { queryPoolByAddress } from "@/app/dashboard/_helpers/pools";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  // todo: add check invitation code

  const { address } = await params;
  const pool = await queryPoolByAddress({ address });
  if (!pool) {
    return notFound();
  }

  return <BuyAndStake pool={pool} />;
}
