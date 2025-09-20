import Link from "next/link";
import { NumericFormat } from "react-number-format";
import Table from "@/app/dashboard/_components/Table";
import TableRow from "@/app/dashboard/_components/TableRow";
import TablePostCell from "@/app/dashboard/_components/TablePostCell";
import Icon from "@/app/dashboard/_components/Icon";
import Image from "@/app/dashboard/_components/Image";
import { Refund } from "@/app/dashboard/_types/refund";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

const tableHead = ["Post", "Status", "Price", "Time", "Customer"];

type ListProps = {
  items: Refund[];
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
        <th className="max-lg:nth-5:hidden max-lg:last:hidden" key={head}>
          {head}
        </th>
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
            <Link className="action" href={ROUTES.income_refunds_details}>
              <Icon name="edit" />
              Detail
            </Link>
            <button className="action">
              <Icon name="trash" />
              Refund
            </button>
            <button className="action">
              <Icon name="chain" />
              Decline
            </button>
          </TablePostCell>
          <td className="max-md:hidden">
            <div
              className={`label ${
                item.status === "in progress"
                  ? "label-yellow"
                  : item.status === "closed"
                    ? "label-gray"
                    : "label-green"
              }`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </div>
          </td>
          <td className="max-md:hidden">
            <NumericFormat
              value={item.price}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              displayType="text"
              prefix="$"
            />
          </td>
          <td className="max-lg:hidden">{item.date}</td>
          <td className="max-lg:hidden">
            <div className="inline-flex items-center gap-3">
              <div className="shrink-0 rounded-full overflow-hidden">
                <Image
                  className="size-9 object-cover"
                  src={item.avatar}
                  width={36}
                  height={36}
                  alt={item.name}
                />
              </div>
              <div className="">{item.name}</div>
            </div>
          </td>
        </TableRow>
      ))}
    </Table>
  );
};

export default List;
