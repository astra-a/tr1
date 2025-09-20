import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection } from "lexical";
import { useContext } from "react";
import ToolbarContext from "../context/ToolbarContext";
import DropDown from "./DropDown";
import {
  BLOCK_TYPE_DEFAULT,
  BLOCK_TYPES,
  HEADING_TAG_TYPES,
} from "../constants";
import { Icons } from "./Icons";

export default function BlockFormatDropdown() {
  const [editor] = useLexicalComposerContext();
  const { blockType } = useContext(ToolbarContext);

  const formatParagraph = () => {
    if (BLOCK_TYPE_DEFAULT !== blockType) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createParagraphNode());
      });
    }
  };

  const formatQuote = () => {
    if ("quote" !== blockType) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (headingSize !== blockType) {
      editor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      });
    }
  };

  const formatBulletList = () => {
    editor.dispatchCommand(
      "bullet" !== blockType
        ? INSERT_UNORDERED_LIST_COMMAND
        : REMOVE_LIST_COMMAND,
      undefined,
    );
  };

  const formatNumberList = () => {
    editor.dispatchCommand(
      "number" !== blockType
        ? INSERT_ORDERED_LIST_COMMAND
        : REMOVE_LIST_COMMAND,
      undefined,
    );
  };

  const formatCheckList = () => {
    editor.dispatchCommand(
      "check" !== blockType ? INSERT_CHECK_LIST_COMMAND : REMOVE_LIST_COMMAND,
      undefined,
    );
  };

  return (
    <DropDown
      buttonLabel={BLOCK_TYPES[blockType]}
      buttonAriaLabel="Formatting options for text style"
      buttonClassName="rich-text-editor-toolbar__item block-controls"
      buttonIcon={
        Icons?.[
          blockType as
            | "paragraph"
            | "h1"
            | "h2"
            | "h3"
            | "h4"
            | "h5"
            | "h6"
            | "bullet"
            | "number"
            | "check"
            | "quote"
        ]
      }
    >
      <button
        type="button"
        className={`rich-text-editor-toolbar__dropdown-item ${BLOCK_TYPE_DEFAULT === blockType ? "active" : ""}`}
        onClick={formatParagraph}
      >
        {Icons.paragraph}
        <span className="text">{BLOCK_TYPES[BLOCK_TYPE_DEFAULT]}</span>
      </button>

      {HEADING_TAG_TYPES.map((type, i) => (
        <button
          key={i}
          type="button"
          className={`rich-text-editor-toolbar__dropdown-item ${type === blockType ? "active" : ""}`}
          onClick={() => formatHeading(type)}
        >
          {Icons[type]}
          <span className="text">{BLOCK_TYPES[type]}</span>
        </button>
      ))}

      <div className="divider" />

      <button
        type="button"
        className={`rich-text-editor-toolbar__dropdown-item ${"bullet" === blockType ? "active" : ""}`}
        onClick={formatBulletList}
      >
        {Icons.bullet}
        <span className="text">{BLOCK_TYPES.bullet}</span>
      </button>

      <button
        type="button"
        className={`rich-text-editor-toolbar__dropdown-item ${"number" === blockType ? "active" : ""}`}
        onClick={formatNumberList}
      >
        {Icons.number}
        <span className="text">{BLOCK_TYPES.number}</span>
      </button>

      <button
        type="button"
        className={`rich-text-editor-toolbar__dropdown-item ${"check" === blockType ? "active" : ""}`}
        onClick={formatCheckList}
      >
        {Icons.check}
        <span className="text">{BLOCK_TYPES.check}</span>
      </button>

      <div className="divider" />

      <button
        type="button"
        className={`rich-text-editor-toolbar__dropdown-item ${"quote" === blockType ? "active" : ""}`}
        onClick={formatQuote}
      >
        {Icons.quote}
        <span className="text">{BLOCK_TYPES.quote}</span>
      </button>
    </DropDown>
  );
}
