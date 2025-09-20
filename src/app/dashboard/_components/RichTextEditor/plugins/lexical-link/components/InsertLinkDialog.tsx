import { useState } from "react";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { LinkFields } from "../types";

export default function InsertLinkDialog({
  selectedText,
  initialFields = { url: "https://", newTab: false, linkType: "custom" },
  onClose,
  onUpdate,
}: {
  selectedText: string;
  initialFields?: LinkFields;
  onClose: () => void;
  onUpdate: (text: string, fields: LinkFields) => void;
}) {
  const [fields, setFields] = useState<LinkFields>(initialFields);

  return (
    <Dialog
      open={true}
      className="relative z-100 focus:outline-none"
      onClose={() => {
        onClose();
      }}
    >
      <DialogBackdrop className="fixed inset-0 backdrop-blur-lg" />
      <div className="fixed inset-0 w-screen h-screen flex items-center justify-center z-10 overflow-hidden">
        <DialogPanel
          transition
          className="w-100 flex flex-col gap-8 px-8 py-6 bg-white border border-black/10 rounded-2xl shadow-xl"
        >
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold">
              Edit Link
            </DialogTitle>
            <CloseButton
              className="text-xl text-black/50 hover:text-black transition cursor-pointer"
              onClick={() => onClose()}
            >
              <FontAwesomeIcon icon={faClose} />
            </CloseButton>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base">Text to display:</label>
              <input
                type="text"
                className="px-3 py-2 border border-black/50 rounded-lg bg-black/10"
                disabled
                readOnly
                value={selectedText}
                onChange={(e) => {
                  // console.log("new text", e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base">Enter a URL:</label>
              <input
                type="text"
                className="px-3 py-2 border border-black/50 rounded-lg"
                value={fields.url}
                onChange={(e) => {
                  // console.log("new url", e.target.value);
                  setFields((prevState) => ({
                    ...prevState,
                    url: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={fields.newTab}
                  onChange={(e) => {
                    // console.log("new tab", e.target.checked);
                    setFields((prevState) => ({
                      ...prevState,
                      newTab: e.target.checked,
                    }));
                  }}
                />
                Open in new tab
              </label>
            </div>
          </div>

          <div className="">
            <button
              type="button"
              className="w-full inline-flex items-center justify-center h-12 border rounded-3xl text-button transition-all cursor-pointer disabled:pointer-events-none"
              onClick={() => {
                onUpdate(selectedText, fields);
              }}
            >
              Save
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
