import { ReactNode } from "react";
import Tooltip from "@/app/dashboard/_components/Tooltip";
import Icon from "@/app/dashboard/_components/Icon";

type FieldProps = {
  className?: string;
  label?: string;
  innerLabel?: boolean;
  tooltip?: string;
  errorMessage?: string;
  errorIcon?: boolean;
  validatedIcon?: boolean;
  children?: ReactNode;
};

const FieldContainer = ({
  className,
  label,
  innerLabel,
  tooltip,
  errorMessage,
  errorIcon = true,
  validatedIcon,
  children,
}: FieldProps) => {
  return (
    <div className={`${innerLabel ? "pt-1.5" : ""} ${className || ""}`}>
      {label && !innerLabel && (
        <div className="flex items-center mb-4">
          <div className="text-button">{label}</div>
          {tooltip && <Tooltip className="ml-1.5" content={tooltip} />}
        </div>
      )}
      <div className="relative">
        {innerLabel && (
          <div className="absolute -top-2.5 left-6 px-1 bg-b-surface2 text-caption pointer-events-none">
            {label}
          </div>
        )}
        {children}
        {errorMessage ? (
          <>
            {errorIcon && (
              <Icon
                className="absolute top-1/2 right-4 -translate-y-1/2 fill-red-500"
                name="close"
              />
            )}
            <div className="absolute top-full left-2 text-xs text-red-500">
              {errorMessage}
            </div>
          </>
        ) : validatedIcon ? (
          <Icon
            className="absolute top-1/2 right-4 -translate-y-1/2 fill-primary-02"
            name="check"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default FieldContainer;
