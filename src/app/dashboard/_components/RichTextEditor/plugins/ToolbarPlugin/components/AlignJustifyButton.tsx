import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function AlignJustifyButton() {
  const [editor] = useLexicalComposerContext();
  const { isAlignJustify } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(
          FORMAT_ELEMENT_COMMAND,
          isAlignJustify ? "" : "justify",
        );
      }}
      className={`rich-text-editor-toolbar__item ${isAlignJustify ? "active" : ""}`}
      aria-label="Align Justify"
    >
      {Icons.alignJustify}
    </button>
  );
}
