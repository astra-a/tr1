import type {
  LexicalNode,
  SerializedElementNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type { DefaultDocumentIDType, JsonValue } from "payload";

export type LinkFields = {
  [key: string]: JsonValue;
  doc?: {
    relationTo: string;
    value:
      | {
          // Actual doc data, populated in afterRead hook
          [key: string]: JsonValue;
          id: DefaultDocumentIDType;
        }
      | DefaultDocumentIDType;
  } | null;
  linkType: "custom" | "internal";
  newTab: boolean;
  url?: string;
};

export type SerializedLinkNode<
  T extends SerializedLexicalNode = SerializedLexicalNode,
> = Spread<
  {
    fields: LinkFields;
    /**
     * @todo make required in 4.0 and type AutoLinkNode differently
     */
    id?: string; // optional if AutoLinkNode
    type: "link";
  },
  SerializedElementNode<T>
>;
export type SerializedAutoLinkNode<
  T extends SerializedLexicalNode = SerializedLexicalNode,
> = {
  type: "autolink";
} & Omit<SerializedLinkNode<T>, "id" | "type">;

/**
 * The payload of a link node
 * This can be delivered from the link node to the drawer, or from the drawer/anything to the TOGGLE_LINK_COMMAND
 */
export type LinkPayload = {
  /**
   * The fields of the link node. Undefined fields will be taken from the default values of the link node
   */
  fields: Partial<LinkFields>;
  selectedNodes?: LexicalNode[];
  /**
   * The text content of the link node - will be displayed in the drawer
   */
  text: null | string;
} | null;
