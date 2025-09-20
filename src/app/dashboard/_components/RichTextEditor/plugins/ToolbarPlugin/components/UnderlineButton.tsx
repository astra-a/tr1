import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function UnderlineButton() {
  const [editor] = useLexicalComposerContext();
  const { isUnderline } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
      }}
      className={`rich-text-editor-toolbar__item ${isUnderline ? "active" : ""}`}
      aria-label="Format Underline"
    >
      {Icons.underline}
    </button>
  );
}
