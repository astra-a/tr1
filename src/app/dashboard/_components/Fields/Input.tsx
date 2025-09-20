import { InputHTMLAttributes, ReactNode } from "react";
import FieldContainer from "@/app/dashboard/_components/FieldContainer";

type FieldProps = {
  className?: string;
  classInput?: string;
  label?: string;
  innerLabel?: boolean;
  tooltip?: string;
  errorMessage?: string;
  errorIcon?: boolean;
  validatedIcon?: boolean;
  children?: ReactNode;
};

const InputField = ({
  className,
  classInput,
  label,
  innerLabel,
  tooltip,
  errorMessage,
  errorIcon,
  validatedIcon,
  children,
  ...inputProps
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <FieldContainer
      className={className}
      label={label}
      innerLabel={innerLabel}
      tooltip={tooltip}
      errorMessage={errorMessage}
      errorIcon={errorIcon}
      validatedIcon={validatedIcon}
    >
      {children}
      <input
        className={`w-full h-12 px-4.5 pr-12 border rounded-full text-body-2 text-t-primary outline-none transition-colors placeholder:text-t-secondary/50 ${
          errorMessage
            ? "border-red-500"
            : "border-s-stroke2 hover:border-s-highlight focus:border-s-highlight"
        } ${innerLabel ? "pl-6.5" : ""} ${classInput || ""}`}
        {...inputProps}
      />
    </FieldContainer>
  );
};

export default InputField;
