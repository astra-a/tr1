import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function ItalicButton() {
  const [editor] = useLexicalComposerContext();
  const { isItalic } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
      }}
      className={`rich-text-editor-toolbar__item ${isItalic ? "active" : ""}`}
      aria-label="Format Italic"
    >
      {Icons.italic}
    </button>
  );
}
