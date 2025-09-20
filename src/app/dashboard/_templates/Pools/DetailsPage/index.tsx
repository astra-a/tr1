"use client";

import { useRouter } from "next/navigation";
import Button from "@/app/dashboard/_components/Button";
import Layout from "@/app/dashboard/_components/Layout";
import Icon from "@/app/dashboard/_components/Icon";
import { Pool } from "@/payload-types";
import PoolInfo from "./PoolInfo";
import Purchases from "./Purchases";
import Statistics from "./Statistics";
import Operations from "./Operations";
import ClaimedList from "./ClaimedList";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

const DetailsPage = ({ pool }: { pool: Pool }) => {
  const router = useRouter();

  return (
    <Layout title="Pool Details" customHeaderActions={<></>}>
      <div className="flex gap-3 mb-3">
        <div className="card w-[50%] p-0">
          <div className="flex p-3 pb-0">
            <Button
              className="mr-auto max-md:w-12 max-md:px-0 max-md:text-0"
              isStroke
              onClick={() => router.push(ROUTES.pools())}
            >
              Back
              <Icon className="!hidden rotate-180 max-md:!block" name="arrow" />
            </Button>
          </div>
          <div className="w-full p-4">
            <PoolInfo pool={pool} />
          </div>
        </div>
        <div className="flex flex-auto flex-col gap-3">
          <Statistics pool={pool} />
          <Operations pool={pool} />
        </div>
      </div>
      <Purchases pool={pool} />
      <ClaimedList pool={pool} />
    </Layout>
  );
};

export default DetailsPage;
