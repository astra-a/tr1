import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function AlignLeftButton() {
  const [editor] = useLexicalComposerContext();
  const { isAlignLeft } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(
          FORMAT_ELEMENT_COMMAND,
          isAlignLeft ? "" : "left",
        );
      }}
      className={`rich-text-editor-toolbar__item ${isAlignLeft ? "active" : ""}`}
      aria-label="Align Left"
    >
      {Icons.alignLeft}
    </button>
  );
}
