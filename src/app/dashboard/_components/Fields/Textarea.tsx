import { ReactNode, TextareaHTMLAttributes } from "react";
import TextareaAutosize from "react-textarea-autosize";
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

const TextareaField = ({
  className,
  classInput,
  label,
  innerLabel,
  tooltip,
  errorMessage,
  errorIcon,
  validatedIcon,
  children,
  ...textareaProps
}: FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style">) => {
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
      <TextareaAutosize
        className={`w-full min-h-22 px-4.5 pr-12 py-2 border rounded-xl text-body-2 text-t-primary outline-none transition-colors placeholder:text-t-secondary/50 ${
          errorMessage
            ? "border-red-500"
            : "border-s-stroke2 hover:border-s-highlight focus:border-s-highlight"
        } ${innerLabel ? "pl-6.5" : ""} ${classInput || ""}`}
        {...textareaProps}
        maxRows={5}
      />
    </FieldContainer>
  );
};

export default TextareaField;
