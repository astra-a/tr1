"use client";

import { InputHTMLAttributes, useEffect, useState } from "react";
import Card from "@/app/dashboard/_components/Card";
import UploadImage from "@/app/dashboard/_components/UploadImage";
import { Media, Post } from "@/payload-types";
import { toast } from "sonner";

const CoverImage = ({
  post,
  onUpload,
  errorMessage,
  ...inputProps
}: {
  post: Post;
  onUpload: (value: string) => void;
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>) => {
  const [coverImage, setCoverImage] = useState<Media | null>(null);
  useEffect(() => {
    if (post?.coverImage) {
      if (typeof post.coverImage === "string") {
        setCoverImage(null);
        setTimeout(() => toast.error("Cover image was lost!"), 100);
      } else {
        setCoverImage(post.coverImage);
        onUpload(post.coverImage?.id ?? "");
      }
    }
  }, [post?.coverImage]);

  return (
    <Card classHead="!px-3" title="Cover Image">
      <div className="relative pb-4">
        <input {...inputProps} />
        <UploadImage
          initialValue={coverImage}
          onUpdate={(media) => {
            setCoverImage(media);
            onUpload(media?.id ?? "");
          }}
        />
        {errorMessage ? (
          <div className="absolute bottom-0 left-2 text-xs text-red-500">
            {errorMessage}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
};

export default CoverImage;
