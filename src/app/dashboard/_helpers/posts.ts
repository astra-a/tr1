/**
 * @see https://payloadcms.com/docs/local-api/overview
 */

import { Post } from "@/payload-types";
import { POST_STATUS } from "@/constants";
import { getPayloadInstance } from "./instance";
import { Sort, Where } from "payload";
import { getAuthUser } from "./users";

const COLLECTION_NAME = "posts";

export const countPosts = async ({ where }: { where?: Where }) => {
  const payload = await getPayloadInstance();
  const result = await payload.count({
    collection: COLLECTION_NAME,
    where,
    depth: 0,
  });
  return result?.totalDocs || 0;
};

export const queryPosts = async ({
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

export const queryPostBySlug = async ({ slug }: { slug: string }) => {
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

export const queryPostById = async ({ id }: { id: string }) => {
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

export const createPost = async ({ data }: { data: Post }) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.create({
    collection: COLLECTION_NAME,
    data,
    overrideAccess: false,
    user,
  });
};

export const updatePostById = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Post>;
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

export const updatePostsStatusByIds = async ({
  ids,
  status,
}: {
  ids: string[];
  status: POST_STATUS;
}) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.update({
    collection: COLLECTION_NAME,
    where: {
      id: { in: ids },
    },
    data: {
      status,
      publishedAt: "",
    },
    overrideAccess: false,
    user,
  });
};

export const deletePostById = async ({ id }: { id: string }) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.delete({
    collection: COLLECTION_NAME,
    id: id,
    overrideAccess: false,
    user,
  });
};

export const deletePostsByIds = async ({ ids }: { ids: string[] }) => {
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
