"use client";

import Layout from "@/app/dashboard/_components/Layout";
import CardChartPie from "@/app/dashboard/_components/CardChartPie";
import Overview from "./Overview";
import TrafficСhannel from "./TrafficСhannel";
import ActiveTimes from "./ActiveTimes";
import SharePosts from "./SharePosts";
import RefundRequests from "./RefundRequests";
import Countries from "./Countries";
import Messages from "./Messages";
import {
  devicesChartData,
  devicesGenderData,
} from "@/app/dashboard/_mocks/charts";

const OverviewPage = () => {
  return (
    <Layout title="Dashboard">
      <div className="flex max-lg:flex-col">
        <div className="col-left">
          <Overview />
          <TrafficСhannel />
          <ActiveTimes />
          <SharePosts />
        </div>
        <div className="col-right">
          <RefundRequests />
          <CardChartPie title="Devices" data={devicesChartData} />
          <Countries />
          <Messages />
          <CardChartPie title="Gender" data={devicesGenderData} />
        </div>
      </div>
    </Layout>
  );
};

export default OverviewPage;
