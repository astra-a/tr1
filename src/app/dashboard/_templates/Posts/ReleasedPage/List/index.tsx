"use client";

import Table from "@/app/dashboard/_components/Table";
import { Post } from "@/payload-types";
import Item from "./Item";

// "Rating", "Views"
const tableHead = [
  "Post",
  "Category",
  "Status",
  "Pin",
  "Published At (UTC 0:00)",
];

type ListProps = {
  posts: Post[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
  selectAll: boolean;
  onSelectAll: () => void;
};

const List = ({
  posts,
  selectedRows,
  onRowSelect,
  selectAll,
  onSelectAll,
}: ListProps) => {
  return (
    <Table
      selectAll={selectAll}
      onSelectAll={onSelectAll}
      cellsThead={tableHead.map((head) => (
        <th className="max-lg:nth-5:hidden max-lg:last:hidden" key={head}>
          {head}
        </th>
      ))}
    >
      {posts.map((post) => (
        <Item
          key={post.id}
          post={post}
          selected={selectedRows.includes(post.id)}
          onRowSelect={onRowSelect}
        />
      ))}
    </Table>
  );
};

export default List;
