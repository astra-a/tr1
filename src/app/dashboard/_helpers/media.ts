/**
 * @see https://payloadcms.com/docs/local-api/overview
 */

import { Media } from "@/payload-types";
import { getPayloadInstance } from "./instance";
import { Sort, Where, File } from "payload";
import { getAuthUser } from "./users";

const COLLECTION_NAME = "media";

export const countMedia = async ({ where }: { where?: Where }) => {
  const payload = await getPayloadInstance();
  const result = await payload.count({
    collection: COLLECTION_NAME,
    where,
    depth: 0,
  });
  return result?.totalDocs || 0;
};

export const queryMedia = async ({
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

export const queryMediaBySlug = async ({ slug }: { slug: string }) => {
  const payload = await getPayloadInstance();
  const result = await payload.find({
    collection: COLLECTION_NAME,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  return result.docs?.[0] || null;
};

export const queryMediaById = async ({ id }: { id: string }) => {
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

export const createMedia = async ({
  data,
  file,
}: {
  data: Media;
  file: File;
}) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.create({
    collection: COLLECTION_NAME,
    data,
    file,
    overrideAccess: false,
    user,
  });
};

export const updateMediaById = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Media>;
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

export const deleteMediaById = async ({ id }: { id: string }) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.delete({
    collection: COLLECTION_NAME,
    id: id,
    overrideAccess: false,
    user,
  });
};

export const deleteMediaByIds = async ({ ids }: { ids: string[] }) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.delete({
    collection: COLLECTION_NAME,
    where: {
      id: { in: ids },
    },
    overrideAccess: false,
    user,
  });
};
