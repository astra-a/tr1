import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function BoldButton() {
  const [editor] = useLexicalComposerContext();
  const { isBold } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
      }}
      className={`rich-text-editor-toolbar__item ${isBold ? "active" : ""}`}
      aria-label="Format Bold"
    >
      {Icons.bold}
    </button>
  );
}
