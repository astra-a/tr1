"use client";

import Layout from "@/app/dashboard/_components/Layout";
import Statistics from "./Statistics";
import Transactions from "./Transactions";

const StatementsPage = () => {
  return (
    <Layout title="Payouts">
      <Statistics />
      <Transactions />
    </Layout>
  );
};

export default StatementsPage;
