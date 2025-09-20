"use client";

import Layout from "@/app/dashboard/_components/Layout";
import RefundRequests from "@/app/dashboard/_components/RefundRequests";
import PopularPosts from "@/app/dashboard/_components/PopularPosts";
import Balance from "./Balance";
import RecentEarnings from "./RecentEarnings";
import Transactions from "./Transactions";
import Countries from "./Countries";

import { popularPosts } from "@/app/dashboard/_mocks/posts";

const EarningPage = () => {
  return (
    <Layout title="Earning">
      <div className="flex max-lg:block">
        <div className="col-left">
          <Balance />
          <RecentEarnings />
          <Transactions />
        </div>
        <div className="col-right">
          <Countries />
          <RefundRequests />
          <PopularPosts title="Top-earning posts" items={popularPosts} />
        </div>
      </div>
    </Layout>
  );
};

export default EarningPage;
