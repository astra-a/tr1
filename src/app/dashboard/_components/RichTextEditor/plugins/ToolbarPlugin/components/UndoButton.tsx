import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { UNDO_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function UndoButton() {
  const [editor] = useLexicalComposerContext();
  const { canUndo } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      disabled={!canUndo}
      onClick={() => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      }}
      className="rich-text-editor-toolbar__item"
      aria-label="Undo"
    >
      {Icons.undo}
    </button>
  );
}
