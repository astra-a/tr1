import { HeadingTagType } from "@lexical/rich-text";

export const BLOCK_TYPE_DEFAULT = "paragraph";

export const BLOCK_TYPES: { [key: string]: string } = {
  paragraph: "Normal Text",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  bullet: "Bullet List", // unordered list
  number: "Numbered List", // ordered list
  check: "Check List",
  quote: "Quote", // Blockquote
};

export const HEADING_TAG_TYPES: HeadingTagType[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];
