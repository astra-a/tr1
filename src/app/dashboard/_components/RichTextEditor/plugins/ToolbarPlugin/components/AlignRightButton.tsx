import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function AlignRightButton() {
  const [editor] = useLexicalComposerContext();
  const { isAlignRight } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(
          FORMAT_ELEMENT_COMMAND,
          isAlignRight ? "" : "right",
        );
      }}
      className={`rich-text-editor-toolbar__item ${isAlignRight ? "active" : ""}`}
      aria-label="Align Right"
    >
      {Icons.alignRight}
    </button>
  );
}
