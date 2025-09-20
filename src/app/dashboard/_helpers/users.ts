/**
 * @see https://payloadcms.com/docs/local-api/overview
 */

import { headers as nextHeaders } from "next/headers";
import { getPayloadInstance } from "./instance";

const COLLECTION_NAME = "users";

export const loginByEmail = async ({
  data,
}: {
  data: { email: string; password: string };
}) => {
  const payload = await getPayloadInstance();
  return payload.login({
    collection: COLLECTION_NAME,
    data,
    depth: 0,
    locale: "en",
    // fallbackLocale: false,
    overrideAccess: false,
    showHiddenFields: true,
  });
};

export const getAuthUser = async () => {
  const payload = await getPayloadInstance();
  const headers = await nextHeaders();
  return payload.auth({ headers, canSetHeaders: false });
};
