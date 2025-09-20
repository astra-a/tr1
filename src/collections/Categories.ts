import type { CollectionConfig } from "payload";
import { slugField } from "./fields/slug";
import { authenticated } from "./access/authenticated";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  defaultPopulate: {
    slug: true,
    title: true,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    ...slugField(),
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      required: false,
      hasMany: false,
    },
  ],
};
