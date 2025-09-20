import { NumericFormat } from "react-number-format";
import millify from "millify";
import Table from "@/app/dashboard/_components/Table";
import TableRow from "@/app/dashboard/_components/TableRow";
import TablePostCell from "@/app/dashboard/_components/TablePostCell";
import Percentage from "@/app/dashboard/_components/Percentage";
import Icon from "@/app/dashboard/_components/Icon";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import SharePost from "@/app/dashboard/_components/SharePost";
import Legend from "./Legend";
import ProgressBar from "./ProgressBar";
import { PostStatistics } from "@/app/dashboard/_types/post";

type PostsStatisticsProps = {
  items: PostStatistics[];
  selectedRows: (string | number)[];
  onRowSelect: (id: string | number) => void;
  selectAll: boolean;
  onSelectAll: () => void;
  isViewers?: boolean;
};

const PostsStatistics = ({
  selectedRows,
  onRowSelect,
  selectAll,
  onSelectAll,
  items,
  isViewers,
}: PostsStatisticsProps) => {
  return (
    <>
      <Legend
        className="hidden pt-2 px-3 max-lg:flex max-md:pb-2"
        data={items[0].trafficSource}
      />
      <Table
        selectAll={selectAll}
        onSelectAll={onSelectAll}
        cellsThead={
          <>
            <th>Post</th>
            <th>{isViewers ? "Views" : "Impressions"}</th>
            <th className="max-lg:hidden">
              <div className="inline-flex items-center w-full">
                {isViewers ? "Viewers" : "Traffic source"}
                <Legend
                  className="max-lg:hidden"
                  data={items[0].trafficSource}
                />
              </div>
            </th>
          </>
        }
      >
        {items.map((item) => (
          <TableRow
            className="max-md:flex max-md:flex-col"
            selectedRows={selectedRows.includes(item.id)}
            onRowSelect={() => onRowSelect(item.id)}
            key={item.id}
          >
            <TablePostCell
              title={item.title}
              details={item.details}
              image={item.image}
              mobileContent={
                <div className="inline-flex items-center gap-2">
                  <div className="min-w-13">
                    {item.value < 9999 ? (
                      <NumericFormat
                        value={item.value}
                        thousandSeparator=","
                        fixedDecimalScale
                        displayType="text"
                      />
                    ) : (
                      millify(item.value, {
                        lowercase: true,
                      })
                    )}
                  </div>
                  <Percentage value={item.percentage} />
                </div>
              }
            >
              <button className="action">
                <Icon name="edit" />
                Edit
              </button>
              <DeleteItems onDelete={async () => {}} />
              <SharePost
                title={item.title}
                details={item.details}
                image={item.image}
              />
            </TablePostCell>
            <td className="max-md:hidden">
              <div className="inline-flex items-center gap-2">
                <div className="min-w-13">
                  {item.value < 9999 ? (
                    <NumericFormat
                      value={item.value}
                      thousandSeparator=","
                      fixedDecimalScale
                      displayType="text"
                    />
                  ) : (
                    millify(item.value, {
                      lowercase: true,
                    })
                  )}
                </div>
                <Percentage value={item.percentage} />
              </div>
            </td>
            <td className="w-160 max-4xl:w-131 max-2xl:w-100 max-xl:w-96 max-lg:w-46 max-md:w-full max-md:!pt-1 max-md:!pb-4">
              <ProgressBar
                percentage={item.traffic}
                data={item.trafficSource}
              />
            </td>
          </TableRow>
        ))}
      </Table>
    </>
  );
};

export default PostsStatistics;
