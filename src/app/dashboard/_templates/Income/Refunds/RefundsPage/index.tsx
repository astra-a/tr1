"use client";

import { useState } from "react";
import Layout from "@/app/dashboard/_components/Layout";
import Search from "@/app/dashboard/_components/Search";
import Tabs from "@/app/dashboard/_components/Tabs";
import Button from "@/app/dashboard/_components/Button";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import NoFound from "@/app/dashboard/_components/NoFound";
import Dropdown from "@/app/dashboard/_components/Dropdown";
import { Refund } from "@/app/dashboard/_types/refund";
import { useSelection } from "@/hooks/useSelection";
import List from "./List";

import { refunds } from "@/app/dashboard/_mocks/refunds";

const views = [
  { id: 1, name: "Open requests" },
  { id: 2, name: "Closed request" },
];

const RefundsPage = () => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState(views[0]);
  const {
    selectedRows,
    selectAll,
    handleRowSelect,
    handleSelectAll,
    handleDeselect,
  } = useSelection<Refund>(refunds);

  return (
    <Layout title="Refunds">
      <div className="card">
        {selectedRows.length === 0 ? (
          <div className="flex items-center max-md:h-12">
            <div className="pl-5 text-h6 max-lg:mr-auto max-lg:pl-3">
              {refunds.length} open request
              {refunds.length !== 1 ? "s" : ""}
            </div>
            <Search
              className="w-70 ml-6 mr-auto max-lg:hidden"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests"
              isGray
            />
            {search === "" && (
              <>
                <Tabs
                  className="max-md:hidden"
                  items={views}
                  value={view}
                  setValue={setView}
                />
                <Dropdown
                  className="hidden max-md:block"
                  items={views}
                  value={view}
                  setValue={setView}
                />
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="mr-6 pl-5 text-h6">
              {selectedRows.length} refund
              {selectedRows.length !== 1 ? "s" : ""} selected
            </div>
            <Button className="mr-auto" isStroke onClick={handleDeselect}>
              Deselect
            </Button>
            <DeleteItems
              counter={selectedRows.length}
              content={`This will definitely delete ${
                selectedRows.length > 1
                  ? `${selectedRows.length} refunds`
                  : "this refund"
              }, and all data will be removed. This action cannot be undone.`}
              onDelete={async () => {}}
              isLargeButton
            />
          </div>
        )}
        {search !== "" ? (
          <NoFound title="No requests found" collectionName="" />
        ) : (
          <div className="p-1 pt-3 max-lg:px-0">
            <List
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              items={refunds}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RefundsPage;
