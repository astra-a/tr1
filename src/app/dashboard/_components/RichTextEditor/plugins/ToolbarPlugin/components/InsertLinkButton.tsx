import { $getSelection, $isRangeSelection } from "lexical";
import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TOGGLE_LINK_COMMAND } from "../../lexical-link";
import InsertLinkDialog from "../../lexical-link/components/InsertLinkDialog";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function InsertLinkButton() {
  const [editor] = useLexicalComposerContext();
  const { isLink } = useContext(ToolbarContext);
  const [selectedText, setSelectedText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
            return;
          }

          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || !selection) {
              return;
            }
            const text = selection.getTextContent();
            if (!text) {
              return;
            }
            setSelectedText(text);
            setOpenDialog(true);
          });
        }}
        className={`rich-text-editor-toolbar__item ${isLink ? "active" : ""}`}
        aria-label="Insert link"
      >
        {Icons.link}
      </button>

      {openDialog &&
        createPortal(
          <InsertLinkDialog
            selectedText={selectedText}
            onClose={() => setOpenDialog(false)}
            onUpdate={(text, fields) => {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, { text, fields });
              setOpenDialog(false);
            }}
          />,
          document.body,
        )}
    </>
  );
}
