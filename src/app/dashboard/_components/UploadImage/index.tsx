"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Media } from "@/payload-types";
import Image from "next/image";
import Icon from "@/app/dashboard/_components/Icon";
import Button from "@/app/dashboard/_components/Button";
import ChooseMediaDialog from "../MediaDialogs/ChooseMediaDialog";
import CreateMediaDialog from "../MediaDialogs/CreateMediaDialog";

export default function UploadImage({
  initialValue,
  onUpdate,
}: {
  initialValue: Media | null;
  onUpdate: (media: Media | null) => void;
}) {
  const [openCreateMediaDialog, setOpenCreateMediaDialog] = useState(false);
  const [openChooseMediaDialog, setOpenChooseMediaDialog] = useState(false);

  return (
    <>
      {initialValue ? (
        <div className="relative flex justify-center rounded-4xl border border-s-stroke2 overflow-hidden">
          <Image
            className="w-auto max-w-full h-auto max-h-100 opacity-100 object-cover"
            src={initialValue.url!}
            width={initialValue.width || 40}
            height={initialValue.height || 40}
            alt="Preview"
            unoptimized
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex flex-row gap-[4.5px]">
            <Button
              type="button"
              icon="edit"
              isWhite
              isCircle
              onClick={() => setOpenChooseMediaDialog(true)}
            />
            <Button
              type="button"
              icon="close"
              isWhite
              isCircle
              onClick={() => onUpdate(null)}
            />
          </div>
        </div>
      ) : (
        <div
          className="relative flex flex-col justify-center items-center h-60 bg-b-surface3 border border-transparent rounded-4xl overflow-hidden transition-colors hover:border-s-highlight cursor-pointer"
          onClick={() => setOpenChooseMediaDialog(true)}
        >
          <Icon className="mb-2 !size-8 fill-t-secondary" name="camera" />
          <div className="text-body-2 text-t-secondary flex flex-row gap-[4.5px]">
            <button
              type="button"
              aria-disabled="false"
              onClick={(e) => {
                e.stopPropagation();
                setOpenCreateMediaDialog(true);
              }}
            >
              <span className="font-bold text-t-primary">Create New</span>
            </button>
            <span>Or</span>
            <button type="button" aria-disabled="false">
              <span className="font-bold text-t-primary">
                Choose from existing
              </span>
            </button>
          </div>
        </div>
      )}

      {openCreateMediaDialog &&
        createPortal(
          <CreateMediaDialog
            onClose={() => setOpenCreateMediaDialog(false)}
            onUpload={(media) => {
              onUpdate(media);
              setOpenCreateMediaDialog(false);
            }}
          />,
          document.body,
        )}

      {openChooseMediaDialog &&
        createPortal(
          <ChooseMediaDialog
            onClose={() => setOpenChooseMediaDialog(false)}
            onSelect={(media) => {
              onUpdate(media);
              setOpenChooseMediaDialog(false);
            }}
          />,
          document.body,
        )}
    </>
  );
}
