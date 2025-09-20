"use client";

import Layout from "@/app/dashboard/_components/Layout";
import PopularPosts from "@/app/dashboard/_components/PopularPosts";
import PostView from "@/app/dashboard/_components/PostView";
import Insights from "./Insights";
import Performance from "./Performance";
import CampaignEarning from "./CampaignEarning";
import CreateLink from "./CreateLink";

import { popularPosts } from "@/app/dashboard/_mocks/posts";

const AffiliateCenterPage = () => {
  return (
    <Layout title="Affiliate center">
      <Insights />
      <div className="flex max-lg:block">
        <div className="col-left">
          <Performance />
          <CampaignEarning />
        </div>
        <div className="col-right">
          <CreateLink />
          <PopularPosts title="Popular posts" items={popularPosts} />
          <PostView />
        </div>
      </div>
    </Layout>
  );
};

export default AffiliateCenterPage;
