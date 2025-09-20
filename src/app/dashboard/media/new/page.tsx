import { Media } from "@/payload-types";
import MediaForm from "@/app/dashboard/_templates/Media/MediaForm";

export default async function Page() {
  const media: Media = {
    id: "",
    alt: "",
    createdAt: "",
    updatedAt: "",
  };

  return <MediaForm media={media} pageTitle="New Media" />;
}
