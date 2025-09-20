"use client";

import Layout from "@/app/dashboard/_components/Layout";
import Statistics from "./Statistics";
import PayoutHistory from "./PayoutHistory";

const PayoutsPage = () => {
  return (
    <Layout title="Payouts">
      <Statistics />
      <PayoutHistory />
    </Layout>
  );
};

export default PayoutsPage;
