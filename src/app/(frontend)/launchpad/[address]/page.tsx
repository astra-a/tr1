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

  return (
    <div className="launchpad-stake w-full max-w-370 min-h-100 mx-auto px-4 sm:px-6 md:px-7 lg:px-8 xl:px-9 2xl:px-10 py-28 relative overflow-hidden antialiased">
      <BuyAndStake pool={pool} />
    </div>
  );
}
