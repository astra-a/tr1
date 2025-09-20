import { useState } from "react";

interface HasId {
  id: string | number;
}

export const useSelection = <T extends HasId>(items: T[]) => {
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleRowSelect = (id: string | number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(items.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeselect = () => {
    setSelectedRows([]);
    setSelectAll(false);
  };

  return {
    selectedRows,
    selectAll,
    handleRowSelect,
    handleSelectAll,
    handleDeselect,
  };
};
