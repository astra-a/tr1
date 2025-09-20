import { useState } from "react";
import Search from "@/app/dashboard/_components/Search";
import Tabs from "@/app/dashboard/_components/Tabs";
import NoFound from "@/app/dashboard/_components/NoFound";
import Button from "@/app/dashboard/_components/Button";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import Dropdown from "@/app/dashboard/_components/Dropdown";
import Market from "./Market";
import PostsStatistics from "./PostsStatistics";
import SetPostsStatus from "./SetPostsStatus";
import { useSelection } from "@/hooks/useSelection";
import { PostMarket } from "@/app/dashboard/_types/post";

import {
  posts,
  postsTrafficSources,
  postsViewers,
} from "@/app/dashboard/_mocks/posts";

const categories = [
  { id: 1, name: "Market" },
  { id: 2, name: "Traffic sources" },
  { id: 3, name: "Viewers" },
];

const Posts = ({}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [visibleSearch, setVisibleSearch] = useState(false);
  const {
    selectedRows,
    selectAll,
    handleRowSelect,
    handleSelectAll,
    handleDeselect,
  } = useSelection<PostMarket>(posts);

  return (
    <div className="card">
      {selectedRows.length === 0 ? (
        <div className="flex items-center max-lg:flex-wrap">
          <div className="flex items-center min-h-12 pl-5 text-h6 max-lg:mr-6 max-lg:pl-3 max-md:mr-auto">
            Posts
          </div>
          <Button
            className="!hidden mr-auto max-lg:!flex max-md:mr-4 max-md:size-6 max-md:border-none"
            icon={visibleSearch ? "close" : "search"}
            onClick={() => setVisibleSearch(!visibleSearch)}
            isStroke
            isCircle
          />
          <Search
            className={`w-70 ml-6 mr-auto max-lg:w-full max-lg:order-4 max-lg:mt-3 max-lg:mx-4 max-md:mx-3 ${
              visibleSearch ? "max-lg:block" : "max-lg:hidden"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts"
            isGray
          />
          <Dropdown
            className="hidden max-md:block"
            items={categories}
            value={category}
            setValue={setCategory}
          />
          {search === "" && (
            <Tabs
              className="max-md:hidden"
              items={categories}
              value={category}
              setValue={setCategory}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center max-md:hidden">
          <div className="mr-6 pl-5 text-h6">
            {selectedRows.length} post
            {selectedRows.length !== 1 ? "s" : ""} selected
          </div>
          <Button className="mr-auto" isStroke onClick={handleDeselect}>
            Deselect
          </Button>
          <DeleteItems
            counter={selectedRows.length}
            onDelete={async () => {}}
            isLargeButton
          />
          <SetPostsStatus counter={selectedRows.length} />
        </div>
      )}
      {search !== "" ? (
        <NoFound title="No posts found" collectionName="" />
      ) : (
        <div className="pt-3 px-1 pb-5 max-lg:px-0 max-lg:pb-0">
          {category.id === 1 && (
            <Market
              items={posts}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
            />
          )}
          {category.id === 2 && (
            <PostsStatistics
              items={postsTrafficSources}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
            />
          )}
          {category.id === 3 && (
            <PostsStatistics
              items={postsViewers}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              isViewers
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
