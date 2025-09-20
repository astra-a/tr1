import Link from "next/link";
import Card from "@/app/dashboard/_components/Card";
import Icon from "@/app/dashboard/_components/Icon";
import Button from "@/app/dashboard/_components/Button";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

const RefundRequests = ({}) => {
  return (
    <Card classHead="!pl-3" title="Refund requests">
      <div className="p-3 pt-0">
        <div className="flex items-center mb-8">
          <div className="flex justify-center items-center shrink-0 size-16 rounded-full bg-b-surface1">
            <Icon className="fill-t-primary" name="bag" />
          </div>
          <div className="grow pl-5 text-body-2 font-medium text-t-secondary [&_a]:text-[0.9375rem] [&_a]:leading-[1.5rem] [&_a]:font-semibold [&_a]:text-t-primary [&_a]:transition-colors [&_a]:hover:text-shade-05 max-2xl:pl-3 max-lg:pl-5 dark:[&_a]:hover:text-shade-08/90">
            You have{" "}
            <Link href={ROUTES.income_refunds}>52 open refund requests</Link> to
            action. This includes{" "}
            <Link href={ROUTES.income_refunds}>8 new requests.</Link> 👀
          </div>
        </div>
        <Button className="w-full" href={ROUTES.dashboard} as="link" isStroke>
          Review refund requests
        </Button>
      </div>
    </Card>
  );
};

export default RefundRequests;
