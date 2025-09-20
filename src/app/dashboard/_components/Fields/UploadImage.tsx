import { ReactNode, useRef, useState } from "react";
import FieldContainer from "@/app/dashboard/_components/FieldContainer";
import Image from "@/app/dashboard/_components/Image";
import Button from "@/app/dashboard/_components/Button";
import Icon from "@/app/dashboard/_components/Icon";

type FieldProps = {
  className?: string;
  classImage?: string;
  label?: string;
  innerLabel?: boolean;
  tooltip?: string;
  initialImage?: string | null;
  onChange?: (file: File | null) => void;
  errorMessage?: string;
  errorIcon?: boolean;
  validatedIcon?: boolean;
  showRemove?: boolean;
  children?: ReactNode;
};

const UploadImage = ({
  className,
  classImage,
  label,
  innerLabel,
  tooltip,
  initialImage,
  onChange,
  errorMessage,
  errorIcon,
  validatedIcon,
  showRemove = true,
  children,
}: FieldProps) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange?.(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange?.(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

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
      {preview ? (
        <div className="relative flex justify-center rounded-4xl border border-s-stroke2 overflow-hidden">
          <Image
            className={`w-auto max-w-full h-auto max-h-100 opacity-100 object-cover ${
              classImage || ""
            }`}
            src={preview}
            width={0}
            height={0}
            alt="Preview"
            unoptimized
          />
          {showRemove && (
            <Button
              className="absolute top-3 right-3"
              icon="close"
              onClick={handleRemove}
              isWhite
              isCircle
            />
          )}
        </div>
      ) : (
        <div className="relative flex flex-col justify-center items-center h-60 bg-b-surface3 border border-transparent rounded-4xl overflow-hidden transition-colors hover:border-s-highlight">
          <input
            ref={inputRef}
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={handleChange}
            accept="image/*"
          />
          <Icon className="mb-2 !size-8 fill-t-secondary" name="camera" />
          <div className="text-body-2 text-t-secondary">
            Drag and drop an image, or{" "}
            <span className="font-bold text-t-primary">Browse</span>
          </div>
        </div>
      )}
    </FieldContainer>
  );
};

export default UploadImage;
