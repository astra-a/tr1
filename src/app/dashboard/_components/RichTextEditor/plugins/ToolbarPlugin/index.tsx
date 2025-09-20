import {
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $isLinkNode } from "../lexical-link";
import { $isUploadNode } from "../lexical-upload";
import { BLOCK_TYPE_DEFAULT } from "./constants";
import ToolbarContext from "./context/ToolbarContext";
import {
  getHeadingTagType,
  getIsQuoteNode,
  getListType,
  getSelectedNode,
} from "./helpers";
import "./ToolbarPlugin.css";

interface IToolbarProps {
  children?: React.ReactElement | React.ReactElement[];
  defaultFontSize?: string /** The default selected font size in the toolbar */;
  defaultFontColor?: string /** The default selected font color in the toolbar */;
  defaultBgColor?: string /** The default selected background color in the toolbar */;
  defaultFontFamily?: string /** The default selected font family in the toolbar */;
}

export default function ToolbarPlugin({
  children,
  defaultFontSize = "15px",
  defaultFontColor = "#000",
  defaultBgColor = "#fff",
  defaultFontFamily = "Arial",
}: IToolbarProps) {
  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setTsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isUploadImage, setIsUploadImage] = useState(false);
  const [isAlignLeft, setIsAlignLeft] = useState(false);
  const [isAlignCenter, setIsAlignCenter] = useState(false);
  const [isAlignRight, setIsAlignRight] = useState(false);
  const [isAlignJustify, setIsAlignJustify] = useState(false);
  const [blockType, setBlockType] = useState(BLOCK_TYPE_DEFAULT);

  const setAlign = (type: ElementFormatType) => {
    setIsAlignLeft("left" === type);
    setIsAlignCenter("center" === type);
    setIsAlignRight("right" === type);
    setIsAlignJustify("justify" === type);
  };

  const updateBlockType = (selection: RangeSelection) => {
    const listType = getListType(selection);
    if (listType) {
      setBlockType(listType);
      return;
    }

    const headingTagType = getHeadingTagType(selection);
    if (headingTagType) {
      setBlockType(headingTagType);
      return;
    }

    if (getIsQuoteNode(selection)) {
      setBlockType("quote");
      return;
    }

    setBlockType(BLOCK_TYPE_DEFAULT);
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsUploadImage(false);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setTsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Update element format
      for (const node of selection.getNodes()) {
        if ($isElementNode(node)) {
          setAlign(node.getFormatType());
          continue;
        }
        const parent = node.getParent();
        if ($isElementNode(parent)) {
          setAlign(parent.getFormatType());
        }
      }

      // Update block type
      updateBlockType(selection);

      // Update links
      const node = getSelectedNode(selection);
      setIsLink($isLinkNode(node) || $isLinkNode(node.getParent()));
    } else {
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setTsStrikethrough(false);
      setIsCode(false);
      setIsLink(false);
      setAlign("");
      setBlockType(BLOCK_TYPE_DEFAULT);

      if ($isNodeSelection(selection) && selection.getNodes().length > 0) {
        if ($isUploadNode(selection.getNodes()[0])) {
          setIsUploadImage(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        // setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  return (
    <ToolbarContext.Provider
      value={{
        // isRTL,
        canUndo,
        canRedo,
        isBold,
        isItalic,
        isUnderline,
        isStrikethrough,
        isCode,
        isLink,
        isUploadImage,
        isAlignLeft,
        isAlignCenter,
        isAlignRight,
        isAlignJustify,
        blockType,
        // fontFamily,
        // fontSize,
        // fontColor,
        // bgColor,
        // isLink,
        // applyStyleText,
        // insertLink,
        // isStrikethrough,
        // isSubscript,
        // isSuperscript,
        // selectedElementKey,
        // codeLanguage,
      }}
    >
      <div className="rich-text-editor-toolbar">{children}</div>
    </ToolbarContext.Provider>
  );
}
