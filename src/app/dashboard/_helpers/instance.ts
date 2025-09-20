import { getPayload } from "payload";
import configPromise from "@payload-config";

export const getPayloadInstance = async () => {
  return getPayload({ config: configPromise });
};
