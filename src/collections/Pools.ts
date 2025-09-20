import type { CollectionConfig } from "payload";
import { POOL_STATUS, PoolStatusList } from "@/constants";
import { authenticated } from "./access/authenticated";

export const Pools: CollectionConfig = {
  slug: "pools",
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
  },
  fields: [
    {
      name: "chainId",
      type: "number",
      required: true,
    },
    {
      name: "network",
      type: "text",
      required: true,
    },
    {
      name: "address",
      type: "text",
      required: false,
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "team",
      type: "text",
      required: true,
    },
    {
      name: "treasury",
      type: "text",
      required: true,
    },
    {
      name: "paymentRules",
      type: "array",
      required: true,
      fields: [
        {
          name: "index",
          type: "number",
          required: true,
        },
        {
          name: "paymentToken",
          type: "group",
          fields: [
            {
              name: "address",
              type: "text",
              required: true,
            },
            {
              name: "name",
              type: "text",
              required: false,
            },
            {
              name: "symbol",
              type: "text",
              required: true,
            },
            {
              name: "decimals",
              type: "number",
              required: true,
            },
          ],
        },
        {
          name: "price",
          type: "text",
          required: true,
        },
        {
          name: "minPurchase",
          type: "text",
          required: true,
        },
        {
          name: "maxPurchase",
          type: "text",
          required: true,
        },
        {
          name: "enabled",
          type: "checkbox",
          required: true,
        },
      ],
    },
    {
      name: "saleToken",
      type: "group",
      required: true,
      fields: [
        {
          name: "address",
          type: "text",
          required: true,
        },
        {
          name: "name",
          type: "text",
          required: false,
        },
        {
          name: "symbol",
          type: "text",
          required: true,
        },
        {
          name: "decimals",
          type: "number",
          required: true,
        },
      ],
    },
    {
      name: "status",
      type: "select",
      options: PoolStatusList,
      required: true,
      defaultValue: POOL_STATUS.Creating,
    },
    {
      name: "isHidden",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "apr",
      type: "number",
      required: true,
    },
    {
      name: "deployedAt",
      type: "number",
      required: true,
    },
    {
      name: "saleStartedAt",
      type: "number",
      required: true,
    },
    {
      name: "saleDuration",
      type: "number",
      required: true,
    },
    {
      name: "lockDuration",
      type: "number",
      required: true,
    },
    {
      name: "pausedDurationSum",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "totalSaleCap",
      type: "text",
      required: true,
    },
    {
      name: "totalSold",
      type: "text",
      required: true,
      defaultValue: "0",
    },
    {
      name: "creator",
      type: "text",
      required: true,
    },
    {
      name: "createdHash",
      type: "text",
      required: false,
    },
  ],
  // indexes: [
  //   { fields: ["status"] },
  // ],
};
