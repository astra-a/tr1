import { $getSelection, $isRangeSelection } from "lexical";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent } from "@lexical/utils";
import { Icons } from "../ToolbarPlugin/components/Icons";
import { getSelectedNode } from "../ToolbarPlugin/helpers";
import InsertLinkDialog from "./components/InsertLinkDialog";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "./index";
import { LinkFields } from "./types";

import "./css.scss";

export function FloatingLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  const ref = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState("");
  const [fields, setFields] = useState<LinkFields>({
    url: "https://",
    newTab: false,
    linkType: "custom",
  });
  const [openDialog, setOpenDialog] = useState(false);

  const hideLinkToolbar = () => {
    setFields({ url: "https://", newTab: false, linkType: "custom" });
    if (ref.current) {
      ref.current.style.opacity = "0";
      ref.current.style.transform = `translate(-10000px, -10000px)`;
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      editor.update(() => {
        if (!ref?.current) return;
        const selection = $getSelection();
        if (!selection || !$isRangeSelection(selection)) {
          hideLinkToolbar();
          return;
        }

        const focusNode = getSelectedNode(selection);
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode);
        if (!focusLinkNode) {
          hideLinkToolbar();
          return;
        }

        setSelectedText(focusLinkNode.getTextContent());
        setFields(focusLinkNode.getFields());

        const editorElement = editor.getRootElement();
        const focusElement = editor.getElementByKey(focusNode.getKey());
        const editorElRect = editorElement?.getBoundingClientRect();
        const focusElRect = focusElement?.getBoundingClientRect();
        // console.log({ editorElRect, focusElRect });
        if (editorElRect && focusElRect) {
          const top =
            focusElRect.top + focusElRect.height + 8 - editorElRect.top;
          const left = focusElRect.left - editorElRect.left;
          ref.current.style.opacity = "1";
          ref.current.style.transform = `translate(${left}px, ${top}px)`;
        } else {
          hideLinkToolbar();
        }
      });
    };

    const editorStateChangeListener = editor.registerUpdateListener(
      ({ editorState }) => {
        handleSelectionChange();
      },
    );

    // return () => {
    //   editorStateChangeListener.remove();
    // };
  }, [editor]);

  return (
    <div ref={ref} className="link-editor">
      <div className="link-input">
        <a href={fields.url} target="_blank" rel="noopener noreferrer">
          {Icons.externalLink}
          {fields.url}
        </a>
        <button
          type="button"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          {Icons.edit}
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          }}
        >
          {Icons.close}
        </button>
      </div>
      {openDialog &&
        createPortal(
          <InsertLinkDialog
            selectedText={selectedText}
            initialFields={fields}
            onClose={() => setOpenDialog(false)}
            onUpdate={(text, fields) => {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, { text, fields });
              setOpenDialog(false);
            }}
          />,
          document.body,
        )}
    </div>
  );
}
