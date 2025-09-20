/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  $getPreviousSelection,
  $getSelection,
  $insertNodes,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import { UploadNode, $createUploadNode } from "./index";
import { InsertUploadPayload } from "./types";

export const INSERT_UPLOAD_COMMAND: LexicalCommand<InsertUploadPayload> =
  createCommand("INSERT_UPLOAD_COMMAND");

// @see https://github.com/payloadcms/payload.git packages/richtext-lexical/src/features/upload/client/plugin/index.tsx
export function UploadPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([UploadNode])) {
      throw new Error("UploadPlugin: UploadNode not registered on editor");
    }
    return mergeRegister(
      editor.registerCommand(
        INSERT_UPLOAD_COMMAND,
        (payload) => {
          editor.update(() => {
            const selection = $getSelection() || $getPreviousSelection();
            // console.log(11, selection, $isRangeSelection(selection), $isNodeSelection(selection));
            if ($isRangeSelection(selection)) {
              const uploadNode = $createUploadNode({
                id: payload.id,
                fields: payload.fields,
                relationTo: payload.relationTo,
                value: payload.value,
                format: payload.format,
              });
              $insertNodes([uploadNode]);

              // // we need to get the focus node before inserting the block node, as $insertNodeToNearestRoot can change the focus node
              // const { focus } = selection
              // const focusNode = focus.getNode()
              // // Insert upload node BEFORE potentially removing focusNode, as $insertNodeToNearestRoot errors if the focusNode doesn't exist
              // $insertNodeToNearestRoot(uploadNode)
              // // Delete the node it it's an empty paragraph
              // if ($isParagraphNode(focusNode) && !focusNode.__first) {
              //     focusNode.remove()
              // }
            }
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}
