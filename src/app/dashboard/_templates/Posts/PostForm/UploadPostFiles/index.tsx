import { useState } from "react";
import Card from "@/app/dashboard/_components/Card";
import FieldFiles from "@/app/dashboard/_components/FieldFiles";

const UploadPostFiles = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  return (
    <Card classHead="!pl-3" title="Upload post files">
      <div className="p-3 pt-0">
        <FieldFiles onChange={handleFileChange} />
      </div>
    </Card>
  );
};

export default UploadPostFiles;
