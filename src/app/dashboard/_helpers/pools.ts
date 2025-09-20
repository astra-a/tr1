/**
 * @see https://payloadcms.com/docs/local-api/overview
 */

import { Pool } from "@/payload-types";
import { getPayloadInstance } from "./instance";
import { Sort, Where } from "payload";
import { getAuthUser } from "./users";

const COLLECTION_NAME = "pools";

export const countPools = async ({ where }: { where?: Where }) => {
  const payload = await getPayloadInstance();
  const result = await payload.count({
    collection: COLLECTION_NAME,
    where,
    depth: 0,
  });
  return result?.totalDocs || 0;
};

export const queryPools = async ({
  where,
  sort,
  limit,
  page,
  depth,
  pagination,
}: {
  where?: Where;
  sort?: Sort;
  limit?: number;
  page?: number;
  depth?: number;
  pagination?: boolean;
  select?: string;
}) => {
  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: COLLECTION_NAME,
    depth,
    pagination,
    where,
    sort,
    limit,
    page,
  });
  return result.docs;
};

export const queryPoolById = async ({ id }: { id: string }) => {
  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: COLLECTION_NAME,
    limit: 1,
    where: {
      id: {
        equals: id,
      },
    },
  });
  return result.docs?.[0] || null;
};

export const queryPoolByAddress = async ({ address }: { address: string }) => {
  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: COLLECTION_NAME,
    limit: 1,
    where: {
      address: {
        equals: address,
      },
    },
  });
  return result.docs?.[0] || null;
};

export const queryPoolByChainAndTransaction = async ({
  chainId,
  createdHash,
}: {
  chainId: number;
  createdHash: string;
}) => {
  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: COLLECTION_NAME,
    limit: 1,
    where: {
      chainId: {
        equals: chainId,
      },
      createdHash: {
        equals: createdHash,
      },
    },
  });
  return result.docs?.[0] || null;
};

export const createPool = async ({
  data,
}: {
  data: Omit<Pool, "id" | "createdAt" | "updatedAt">;
}) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.create({
    collection: COLLECTION_NAME,
    data,
    overrideAccess: false,
    user,
  });
};

export const updatePoolById = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Pool>;
}) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.update({
    collection: COLLECTION_NAME,
    id: id,
    data,
    overrideAccess: false,
    user,
  });
};

export const deletePoolById = async ({ id }: { id: string }) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.delete({
    collection: COLLECTION_NAME,
    id: id,
    overrideAccess: false,
    user,
  });
};
