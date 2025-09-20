/**
 * @see https://payloadcms.com/docs/local-api/overview
 */

import { Category } from "@/payload-types";
import { getPayloadInstance } from "./instance";
import { Sort, Where } from "payload";
import { getAuthUser } from "./users";

const COLLECTION_NAME = "categories";

export const countCategories = async ({ where }: { where?: Where }) => {
  const payload = await getPayloadInstance();
  const result = await payload.count({
    collection: COLLECTION_NAME,
    where,
    depth: 0,
  });
  return result?.totalDocs || 0;
};

export const queryCategories = async ({
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

export const queryCategoryBySlug = async ({ slug }: { slug: string }) => {
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

export const queryCategoryById = async ({ id }: { id: string }) => {
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

export const createCategory = async ({ data }: { data: Category }) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.create({
    collection: COLLECTION_NAME,
    data,
    overrideAccess: false,
    user,
  });
};

export const updateCategoryById = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<Category>;
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

export const deleteCategoryById = async ({ id }: { id: string }) => {
  const payload = await getPayloadInstance();
  const { user } = await getAuthUser();
  return payload.delete({
    collection: COLLECTION_NAME,
    id: id,
    overrideAccess: false,
    user,
  });
};

export const deleteCategoriesByIds = async ({ ids }: { ids: string[] }) => {
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

// ----

export const arrayToTree = (
  arr: Category[],
  root: string | null,
  ignoreIds?: string[],
) => {
  const len = arr.length;
  function loop(root: string | null) {
    const res: {
      id: string;
      name: string;
      children: { id: string; name: string }[];
    }[] = [];
    for (let i = 0; i < len; i++) {
      if (ignoreIds?.length && ignoreIds.includes(arr[i].id)) {
        continue;
      }
      const item: {
        id: string;
        name: string;
        children: { id: string; name: string }[];
      } = { id: arr[i].id, name: arr[i].title, children: [] };
      if (undefined !== arr[i].parent) {
        if (null === arr[i].parent) {
          if (null === root) {
            item.children = loop(item.id);
            res.push(item);
          }
        } else if (typeof arr[i].parent !== "string") {
          if (root === (arr[i].parent as Category).id) {
            item.children = loop(item.id);
            res.push(item);
          }
        }
      }
    }
    return res;
  }
  return loop(root);
};

export const deepTraversal = (
  data: {
    id: string;
    name: string;
    children: { id: string; name: string }[];
  }[],
) => {
  const result: { id: string; name: string }[] = [];
  data.forEach((item) => {
    const loop = (
      data: {
        id: string;
        name: string;
        children: { id: string; name: string }[];
      },
      prefix: string,
    ) => {
      result.push({
        id: data.id,
        name: `${prefix}${data.name}`,
      });
      const child = data.children as {
        id: string;
        name: string;
        children: { id: string; name: string }[];
      }[];
      if (child?.length) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i], `  ${prefix}`);
        }
      }
    };
    loop(item, "");
  });
  return result;
};

export const getCategoryList = (
  input: Category[],
  ignoreIds?: string[],
): { id: string; name: string }[] => {
  return deepTraversal(arrayToTree(input, null, ignoreIds));
};
