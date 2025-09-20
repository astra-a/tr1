import { notFound } from "next/navigation";
import { queryMediaById } from "@/app/dashboard/_helpers/media";
import MediaForm from "@/app/dashboard/_templates/Media/MediaForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await queryMediaById({ id });
  console.log("media", media);

  if (!media) {
    return notFound();
  }

  return <MediaForm media={media} pageTitle="Edit media" />;
}
