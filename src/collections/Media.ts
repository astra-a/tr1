import type { CollectionConfig } from "payload";
import { authenticated } from "./access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],

  // @see https://payloadcms.com/docs/upload/overview
  upload: {
    staticDir: "uploads/media",
  },
};
