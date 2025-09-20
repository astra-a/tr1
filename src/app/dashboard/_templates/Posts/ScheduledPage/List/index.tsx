import Table from "@/app/dashboard/_components/Table";
import TableRow from "@/app/dashboard/_components/TableRow";
import TablePostCell from "@/app/dashboard/_components/TablePostCell";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import SchedulePost from "@/app/dashboard/_components/SchedulePost";
import { PostDraft } from "@/app/dashboard/_types/post";

const tableHead = ["Post", "Price", "Last edited"];

type ListProps = {
  items: PostDraft[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
  selectAll: boolean;
  onSelectAll: () => void;
};

const List = ({
  selectedRows,
  onRowSelect,
  selectAll,
  onSelectAll,
  items,
}: ListProps) => {
  return (
    <Table
      selectAll={selectAll}
      onSelectAll={onSelectAll}
      cellsThead={tableHead.map((head) => (
        <th key={head}>{head}</th>
      ))}
    >
      {items.map((item) => (
        <TableRow
          selectedRows={selectedRows.includes(item.id)}
          onRowSelect={() => onRowSelect(item.id)}
          key={item.id}
        >
          <TablePostCell
            title={item.title}
            details={item.details}
            image={item.image}
          >
            <button className="action">
              <Icon name="edit" />
              Edit
            </button>
            <DeleteItems onDelete={async () => {}} />
            <SchedulePost
              title={item.title}
              details={item.category}
              image={item.image}
              price={item.price}
              reSchedule
            />
          </TablePostCell>
          <td className="min-w-40 max-lg:min-w-auto max-md:hidden">
            <div
              className={`label ${
                item.price === 0 ? "label-gray text-t-primary" : "label-green"
              }`}
            >
              ${item.price}
            </div>
          </td>
          <td className="text-t-secondary max-md:hidden">{item.date}</td>
        </TableRow>
      ))}
    </Table>
  );
};

export default List;
