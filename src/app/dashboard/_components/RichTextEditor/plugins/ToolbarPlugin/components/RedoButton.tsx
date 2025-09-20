import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { REDO_COMMAND } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import { Icons } from "./Icons";

export default function RedoButton() {
  const [editor] = useLexicalComposerContext();
  const { canRedo } = useContext(ToolbarContext);

  return (
    <button
      type="button"
      disabled={!canRedo}
      onClick={() => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
      }}
      className="rich-text-editor-toolbar__item"
      aria-label="Redo"
    >
      {Icons.redo}
    </button>
  );
}
