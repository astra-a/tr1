"use client";

import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ChooseMediaDialog from "@/app/dashboard/_components/MediaDialogs/ChooseMediaDialog";
import CreateMediaDialog from "@/app/dashboard/_components/MediaDialogs/CreateMediaDialog";
import { INSERT_UPLOAD_COMMAND } from "../../lexical-upload/LexicalUploadPlugin";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function UploadImageButton() {
  const [editor] = useLexicalComposerContext();
  const { isUploadImage } = useContext(ToolbarContext);
  const [openCreateMediaDialog, setOpenCreateMediaDialog] = useState(false);
  const [openChooseMediaDialog, setOpenChooseMediaDialog] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpenChooseMediaDialog(true)}
        className={`rich-text-editor-toolbar__item ${isUploadImage ? "active" : ""}`}
        aria-label="Upload Image"
      >
        {Icons.uploadImage}
      </button>

      {openCreateMediaDialog &&
        createPortal(
          <CreateMediaDialog
            onClose={() => setOpenCreateMediaDialog(false)}
            onUpload={(media) => {
              // console.log('selected', media.id, media.url, media.alt);
              setOpenCreateMediaDialog(false);
              editor.dispatchCommand(INSERT_UPLOAD_COMMAND, {
                fields: null,
                relationTo: "media",
                value: media,
                format: "",
              });
            }}
            showChooseButton
            switchToChoose={() => {
              setOpenCreateMediaDialog(false);
              setOpenChooseMediaDialog(true);
            }}
          />,
          document.body,
        )}

      {openChooseMediaDialog &&
        createPortal(
          <ChooseMediaDialog
            onClose={() => setOpenChooseMediaDialog(false)}
            onSelect={(media) => {
              // console.log('selected', media.id, media.url, media.alt);
              setOpenChooseMediaDialog(false);
              editor.dispatchCommand(INSERT_UPLOAD_COMMAND, {
                fields: null,
                relationTo: "media",
                value: media,
                format: "",
              });
            }}
            showCreateButton
            switchToCreate={() => {
              setOpenChooseMediaDialog(false);
              setOpenCreateMediaDialog(true);
            }}
          />,
          document.body,
        )}
    </>
  );
}
