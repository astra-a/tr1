import { useState } from "react";
import Jdenticon from "react-jdenticon";
import Card from "@/app/dashboard/_components/Card";
import Field from "@/app/dashboard/_components/Field";
import Select from "@/app/dashboard/_components/Select";
import Editor from "@/app/dashboard/_components/Editor";
import { User } from "@/payload-types";

const locations = [
  { id: 1, name: "Canada" },
  { id: 2, name: "United States" },
  { id: 3, name: "United Kingdom" },
  { id: 4, name: "Australia" },
];

const ProfileInformation = ({ user }: { user: User }) => {
  const [preview, setPreview] = useState<string | null>(
    "/images/dashboard/avatar.png",
  );
  const [displayName, setDisplayName] = useState("Admin");
  const [email, setEmail] = useState(user.email);
  const [location, setLocation] = useState(locations[0]);
  const [content, setContent] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  return (
    <Card title="Profile Information">
      <div className="flex flex-col gap-8 p-5 pt-0 max-lg:px-3">
        <div className="flex items-center">
          <div className="relative flex justify-center items-center shrink-0 w-20 h-20 overflow-hidden bg-b-surface1">
            <Jdenticon size={80} value={user.email} />
            <input
              type="file"
              className="absolute z-3 inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="grow max-w-88 pl-4 text-caption text-t-secondary">
            Update your avatar by clicking the image beside. 288x288 px size
            recommended in PNG or JPG format only.
          </div>
        </div>
        <Field
          label="Display Name"
          placeholder="Enter display name"
          tooltip="Maximum 100 characters. No HTML or emoji allowed"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          validated
        />
        <Field
          label="Email"
          placeholder="Enter email"
          tooltip="Maximum 100 characters. No HTML or emoji allowed"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          validated
        />
        {/*<Select*/}
        {/*  label="Location"*/}
        {/*  tooltip="Maximum 100 characters. No HTML or emoji allowed"*/}
        {/*  value={location}*/}
        {/*  onChange={setLocation}*/}
        {/*  options={locations}*/}
        {/*/>*/}
        <Editor
          label="Bio"
          tooltip="Maximum 100 characters. No HTML or emoji allowed"
          content={content}
          onChange={setContent}
        />
      </div>
    </Card>
  );
};

export default ProfileInformation;
