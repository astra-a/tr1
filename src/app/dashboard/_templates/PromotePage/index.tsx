"use client";

import Layout from "@/app/dashboard/_components/Layout";
import PostView from "@/app/dashboard/_components/PostView";
import Insights from "./Insights";
import List from "./List";
import Engagement from "./Engagement";
import Interactions from "./Interactions";

const PromotePage = () => {
  return (
    <Layout title="Promote">
      <Insights />
      <div className="flex max-lg:block">
        <div className="col-left">
          <List />
        </div>
        <div className="col-right">
          <Engagement />
          <Interactions />
          <PostView />
        </div>
      </div>
    </Layout>
  );
};

export default PromotePage;
