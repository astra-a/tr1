import { ElementNode, RangeSelection, TextNode } from "lexical";
import { $isListNode, ListType } from "@lexical/list";
import {
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $isAtNodeEnd } from "@lexical/selection";

export const getListType = (
  selection: RangeSelection,
): ListType | undefined => {
  let listType: ListType | undefined = undefined;
  for (const node of selection.getNodes()) {
    if ($isListNode(node)) {
      listType = node.getListType();
      continue;
    }

    const parent = node.getParent();
    if ($isListNode(parent)) {
      listType = parent.getListType();
      continue;
    }

    const parentParent = parent?.getParent();
    if ($isListNode(parentParent)) {
      listType = parentParent.getListType();
      continue;
    }
    return listType;
  }
  return listType;
};

export const getHeadingTagType = (
  selection: RangeSelection,
): HeadingTagType | undefined => {
  let type: HeadingTagType | undefined = undefined;
  for (const node of selection.getNodes()) {
    if ($isHeadingNode(node)) {
      type = node.getTag();
      continue;
    }
    const parent = node.getParent();
    if ($isHeadingNode(parent)) {
      type = parent.getTag();
      continue;
    }
    return type;
  }
  return type;
};

export const getIsQuoteNode = (selection: RangeSelection) => {
  for (const node of selection.getNodes()) {
    if (!$isQuoteNode(node) && !$isQuoteNode(node.getParent())) {
      return false;
    }
  }
  return true;
};

export const getSelectedNode = (
  selection: RangeSelection,
): TextNode | ElementNode => {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
};
