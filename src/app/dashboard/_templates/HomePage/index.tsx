"use client";

import { Chain } from "viem";
import Layout from "@/app/dashboard/_components/Layout";
import { Pool } from "@/payload-types";
import IncomeBalance from "./IncomeBalance";
import SaleBalance from "./SaleBalance";
import Purchases from "./Purchases";
import ClaimedList from "./ClaimedList";

const HomePage = ({ chain, pools }: { chain: Chain; pools: Pool[] }) => {
  return (
    <Layout title="Home">
      <div className="flex gap-3 max-lg:block mb-3">
        <div className="w-[40%]">
          <IncomeBalance chain={chain} />
        </div>
        <div className="w-[60%]">
          <SaleBalance chain={chain} />
        </div>
      </div>
      <Purchases chain={chain} pools={pools} />
      <ClaimedList chain={chain} pools={pools} />
    </Layout>
  );
};

export default HomePage;
