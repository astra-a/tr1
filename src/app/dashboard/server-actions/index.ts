"use server";

import { getAuthUser } from "@/app/dashboard/_helpers/users";
import { User } from "@/payload-types";

export async function GetAuthUser(): Promise<User | null> {
  const { user } = await getAuthUser();
  return user;
}
