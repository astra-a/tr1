import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import { slugField } from "./fields/slug";
import { POST_STATUS, PostStatusList } from "@/constants";
import { authenticated } from "./access/authenticated";

export const Posts: CollectionConfig = {
  slug: "posts",
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
  fields: [
    ...slugField(),
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
      required: false,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: false,
      hasMany: false,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
    },
    {
      name: "status",
      type: "select",
      options: PostStatusList,
      required: true,
      defaultValue: POST_STATUS.Draft,
    },
    {
      name: "isPin",
      type: "checkbox",
      // required: true,
      defaultValue: false,
    },
    {
      name: "publishedAt",
      type: "date",
      hooks: {
        beforeChange: [
          async ({ siblingData, value }) => {
            if (
              siblingData.status === POST_STATUS.Published &&
              !siblingData.publishedAt
            ) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
  ],
  indexes: [
    { fields: ["status"] },
    { fields: ["status", "isPin", "publishedAt"] },
  ],
};
