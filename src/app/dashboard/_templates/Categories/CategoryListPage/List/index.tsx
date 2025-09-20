"use client";

import Table from "@/app/dashboard/_components/Table";
import { Category } from "@/payload-types";
import Item from "./Item";

const tableHead = ["Category", "Parent", "Last Edited"];

type ListProps = {
  categories: Category[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
  selectAll: boolean;
  onSelectAll: () => void;
};

const List = ({
  categories,
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
        <th className="max-lg:last:hidden" key={head}>
          {head}
        </th>
      ))}
    >
      {categories.map((category) => (
        <Item
          key={category.id}
          category={category}
          selected={selectedRows.includes(category.id)}
          onRowSelect={onRowSelect}
        />
      ))}
    </Table>
  );
};

export default List;
