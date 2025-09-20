import { Media } from "@/payload-types";
import { ElementFormatType, Spread } from "lexical";
import { SerializedDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

export type ImageAttributes = {
  width?: string;
  height?: string;
};

export type ImageFormatType = "left" | "center" | "right";

export type UploadData = {
  id?: null | string;
  fields?: null | string; // todo: update type
  relationTo?: null | string;
  value?: null | string | Media;
  format: ElementFormatType;
  attributes?: null | ImageAttributes;
};

export type SerializedUploadNode = Spread<
  UploadData,
  SerializedDecoratorBlockNode
>;

export type InsertUploadPayload = Readonly<
  Omit<UploadData, "id"> & Partial<Pick<UploadData, "id">>
>;
