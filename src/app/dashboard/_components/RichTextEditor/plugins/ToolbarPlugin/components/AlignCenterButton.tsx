import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function AlignCenterButton() {
  const [editor] = useLexicalComposerContext();
  const { isAlignCenter } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      onClick={() => {
        editor.dispatchCommand(
          FORMAT_ELEMENT_COMMAND,
          isAlignCenter ? "" : "center",
        );
      }}
      className={`rich-text-editor-toolbar__item ${isAlignCenter ? "active" : ""}`}
      aria-label="Align Center"
    >
      {Icons.alignCenter}
    </button>
  );
}
