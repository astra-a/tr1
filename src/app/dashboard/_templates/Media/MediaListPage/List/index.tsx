"use client";

import Table from "@/app/dashboard/_components/Table";
import { Media } from "@/payload-types";
import Item from "./Item";

const tableHead = ["Media", "Alt", "Last Edited"];

type ListProps = {
  mediaArray: Media[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
  selectAll: boolean;
  onSelectAll: () => void;
};

const List = ({
  mediaArray,
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
      {mediaArray.map((media) => (
        <Item
          key={media.id}
          media={media}
          selected={selectedRows.includes(media.id)}
          onRowSelect={onRowSelect}
        />
      ))}
    </Table>
  );
};

export default List;
