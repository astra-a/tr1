/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
} from "lexical";
import { $applyNodeReplacement } from "lexical";
import { DecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import React from "react";
import ObjectID from "bson-objectid";
import { Media } from "@/payload-types";
import { ImageUploaded, ImageNoUpload } from "./component";
import {
  ImageAttributes,
  ImageFormatType,
  SerializedUploadNode,
  UploadData,
} from "./types";

/** @noInheritDoc */
export class UploadNode extends DecoratorBlockNode {
  /** @internal */
  __id: null | string;
  /** @internal */
  __fields: null | string;
  /** @internal */
  __relationTo: null | string;
  /** @internal */
  __value: null | string;
  /** @internal */
  __media: null | Media;
  /** @internal */
  __attributes: null | ImageAttributes;

  static getType(): string {
    return "upload";
  }

  static clone(node: UploadNode): UploadNode {
    // console.log('UploadNode.clone', node.exportJSON(), node.__media);
    return new UploadNode(
      node.exportJSON(),
      node.__media,
      node.__format,
      node.__key,
    );
  }

  constructor(
    data: UploadData,
    media: null | Media,
    format?: ElementFormatType,
    key?: NodeKey,
  ) {
    super(format, key);
    console.log("UploadNode.constructor", data, format, key);
    const {
      id = null,
      fields = null,
      relationTo = null,
      attributes = null,
    } = data;
    this.__id = id;
    this.__fields = fields;
    this.__relationTo = relationTo;
    this.__attributes = attributes;
    this.__value = media ? media.id : null;
    this.__media = media;
  }

  // static importDOM(): DOMConversionMap | null {
  //     return {
  //         a: (node: Node) => ({
  //             conversion: $convertAnchorElement,
  //             priority: 1,
  //         }),
  //     };
  // }

  static importJSON(serializedNode: SerializedUploadNode): UploadNode {
    // return $createUploadNode().updateFromJSON(serializedNode);
    return $createUploadNode(serializedNode);
  }

  updateFromJSON(
    serializedNode: LexicalUpdateJSON<SerializedUploadNode>,
  ): this {
    console.log("serializedNode", serializedNode);
    const media = getStandardMedia(serializedNode.value);
    return super
      .updateFromJSON(serializedNode)
      .setId(serializedNode.id ?? null)
      .setFields(serializedNode.fields ?? null)
      .setRelationTo(serializedNode.relationTo ?? null)
      .setAttributes(serializedNode.attributes ?? null)
      .setValue(media ? media.id : null)
      .setMedia(media);
  }

  exportJSON(): SerializedUploadNode {
    return {
      ...super.exportJSON(),
      version: 3,
      id: this.getId(),
      fields: this.getFields(),
      relationTo: this.getRelationTo(),
      value: this.getValue(),
      attributes: this.getAttributes(),
    };
  }

  getId(): null | string {
    return this.getLatest().__id;
  }

  setId(id: null | string): this {
    const writable = this.getWritable();
    writable.__id = id;
    return writable;
  }

  getFields(): null | string {
    return this.getLatest().__fields;
  }

  setFields(fields: null | string): this {
    const writable = this.getWritable();
    writable.__fields = fields;
    return writable;
  }

  getRelationTo(): null | string {
    return this.getLatest().__relationTo;
  }

  setRelationTo(relationTo: null | string): this {
    const writable = this.getWritable();
    writable.__relationTo = relationTo;
    return writable;
  }

  getValue(): null | string {
    return this.getLatest().__value;
  }

  setValue(value: null | string): this {
    const writable = this.getWritable();
    writable.__value = value;
    return writable;
  }

  getMedia(): null | Media {
    return this.getLatest().__media;
  }

  setMedia(media: null | Media): this {
    const writable = this.getWritable();
    writable.__media = media;
    return writable;
  }

  getAttributes(): null | ImageAttributes {
    return this.getLatest().__attributes;
  }

  setAttributes(attributes: null | ImageAttributes): this {
    const writable = this.getWritable();
    writable.__attributes = attributes;
    return writable;
  }

  decorate(editor: LexicalEditor, config: EditorConfig) {
    // return super.decorate(editor, config);
    // console.log('UploadNode.decorate', editor, config);

    if (this.__media) {
      return (
        <ImageUploaded
          nodeKey={this.getKey()}
          media={this.__media}
          format={this.__format as ImageFormatType}
          updateFormat={(format) => {
            editor.update(() => this.setFormat(format as ElementFormatType));
          }}
          attributes={this.__attributes}
          updateAttributes={(attributes) => {
            editor.update(() => this.setAttributes(attributes ?? null));
          }}
        />
      );
    } else {
      return (
        <ImageNoUpload
          onRemove={() => {
            editor.update(() => {
              this.remove(true);
            });
          }}
        />
      );
    }
  }

  // setFormat(format: ElementFormatType): this {
  //     console.log(1111, 'setFormat', format);
  //     return super.setFormat(format);
  // }

  // createDOM(): HTMLElement {
  //     return document.createElement('div');
  // }
  //
  // updateDOM(): false {
  //     return false;
  // }
}

/**
 * Create a UploadNode.
 * @returns The UploadNode.
 */
export function $createUploadNode(
  data: Omit<UploadData, "id"> & Partial<Pick<UploadData, "id">>,
): UploadNode {
  if (!data?.id) {
    data.id = new ObjectID().toHexString();
  }
  return $applyNodeReplacement(
    new UploadNode(data, getStandardMedia(data.value), data?.format),
  );
}

export function getStandardMedia(input?: null | string | Media): null | Media {
  let media: null | Media = null;
  if (input) {
    // console.log('UploadNode.$createUploadNode', typeof input);
    if ("string" === typeof input) {
    } else {
      media = input;
    }
  }
  return media;
}

/**
 * Determines if node is a UploadNode.
 * @param node - The node to be checked.
 * @returns true if node is a UploadNode, false otherwise.
 */
export function $isUploadNode(
  node: LexicalNode | null | undefined,
): node is UploadNode {
  return node instanceof UploadNode;
}
