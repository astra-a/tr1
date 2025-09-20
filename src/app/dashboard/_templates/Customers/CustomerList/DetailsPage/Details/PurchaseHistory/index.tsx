import { NumericFormat } from "react-number-format";
import Image from "@/app/dashboard/_components/Image";

import { postsPurchaseHistory } from "@/app/dashboard/_mocks/posts";

const PurchaseHistory = ({}) => (
  <div>
    <div className="text-h5 max-lg:text-h6 max-md:mb-3">Purchase history</div>
    <table className="w-full">
      <thead>
        <tr className="[&_th]:h-17 [&_th]:pl-6 [&_th:first-child]:pl-0 [&_th]:align-middle [&_th]:text-left [&_th]:text-caption [&_th]:font-normal [&_th]:text-t-tertiary/80 max-md:[&_th]:h-8">
          <th>Post</th>
          <th className="max-md:hidden">Sales</th>
          <th className="max-lg:hidden">Time</th>
        </tr>
      </thead>
      <tbody>
        {postsPurchaseHistory.map((post) => (
          <tr
            className="[&_td]:py-4 [&_td]:pl-6 [&_td:first-child]:pl-0 [&_td]:border-t [&_td]:border-s-subtle [&_td]:align-middle [&_td]:text-body-2"
            key={post.id}
          >
            <td className="!text-0">
              <div className="inline-flex items-center gap-6 max-lg:gap-4">
                <Image
                  className="size-16 rounded-xl opacity-100"
                  src={post.image}
                  width={64}
                  height={64}
                  alt={post.title}
                />
                <div className="grow">
                  <div className="text-sub-title-1">{post.title}</div>
                  <div className="text-body-2 text-t-secondary/80 max-md:hidden">
                    {post.category}
                  </div>
                  <NumericFormat
                    className="hidden text-body-2 opacity-80 max-md:inline"
                    value={post.sales}
                    thousandSeparator=","
                    fixedDecimalScale
                    decimalScale={2}
                    displayType="text"
                    prefix="$"
                  />
                </div>
              </div>
            </td>
            <td className="max-md:hidden">
              <NumericFormat
                value={post.sales}
                thousandSeparator=","
                fixedDecimalScale
                decimalScale={2}
                displayType="text"
                prefix="$"
              />
            </td>
            <td className="max-lg:hidden">{post.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PurchaseHistory;
