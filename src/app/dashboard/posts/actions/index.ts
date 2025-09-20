"use server";

import { countPosts } from "@/app/dashboard/_helpers/posts";
import { POST_STATUS } from "@/constants";

// todo: delete
export async function CountPosts(status: POST_STATUS): Promise<number> {
  return countPosts({
    where: {
      status: { equals: status },
    },
  });
}
