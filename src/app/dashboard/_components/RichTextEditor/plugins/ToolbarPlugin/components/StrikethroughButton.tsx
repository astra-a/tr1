import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function StrikethroughButton() {
  const [editor] = useLexicalComposerContext();
  const { isStrikethrough } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
      }}
      className={`rich-text-editor-toolbar__item ${isStrikethrough ? "active" : ""}`}
      aria-label="Format Strikethrough"
    >
      {Icons.strikethrough}
    </button>
  );
}
