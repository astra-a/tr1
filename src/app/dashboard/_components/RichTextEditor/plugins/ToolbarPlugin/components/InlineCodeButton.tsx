import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function InlineCodeButton() {
  const [editor] = useLexicalComposerContext();
  const { isCode } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
      }}
      className={`rich-text-editor-toolbar__item ${isCode ? "active" : ""}`}
      aria-label="Format Inline Code"
    >
      {Icons.inlineCode}
    </button>
  );
}
