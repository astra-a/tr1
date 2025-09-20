"use client";

import Layout from "@/app/dashboard/_components/Layout";
import PostView from "@/app/dashboard/_components/PostView";
import Overview from "./Overview";
import PostActivity from "./PostActivity";
import Posts from "./Posts";

const OverviewPage = () => {
  return (
    <Layout title="Post overview">
      <Overview />
      <div className="flex mb-3 max-lg:flex-col">
        <PostActivity />
        <PostView className="col-right" />
      </div>
      <Posts />
    </Layout>
  );
};

export default OverviewPage;
