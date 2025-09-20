import { COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $toggleLink, LinkNode, TOGGLE_LINK_COMMAND } from "./index";
import { LinkFields, LinkPayload } from "./types";

// @see https://github.com/payloadcms/payload.git packages/richtext-lexical/src/features/link/client/plugins/link/index.tsx
export function LinkPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error("LinkPlugin: LinkNode not registered on editor");
    }
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload: LinkPayload) => {
          // console.log("TOGGLE_LINK_COMMAND", payload);
          if (payload === null) {
            $toggleLink(null);
            return true;
          }
          if (!payload.fields?.linkType) {
            payload.fields.linkType = "custom";
          }
          if (!payload.fields?.url) {
            payload.fields.url = "https://";
          }
          $toggleLink(payload as { fields: LinkFields } & LinkPayload);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return null;
}
