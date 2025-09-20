"use client";

import Icon from "@/app/dashboard/_components/Icon";
import Tooltip from "@/app/dashboard/_components/Tooltip";
import { ReactNode } from "react";

const Parameter = ({
  label,
  tooltip,
  content,
}: {
  label: string;
  tooltip?: string;
  content: ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center gap-8 px-8 py-5 border-t border-s-subtle max-2xl:px-5 max-lg:w-1/2 max-lg:even:border-l max-lg:even:border-s-subtle max-md:w-full max-md:min-h-13 max-md:p-3 max-md:even:border-l-0">
      <div className="flex items-center gap-2 text-body-2 text-t-secondary">
        {label}
        {tooltip && (
          <Tooltip className="opacity-100" content={tooltip}>
            <Icon className="!size-5 fill-[#6F767E]" name="info" />
          </Tooltip>
        )}
      </div>
      <div className="text-button">{content}</div>
    </div>
  );
};

export default Parameter;
