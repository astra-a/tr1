import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: {
    tokenExpiration: Number(process.env.AUTH_TOKEN_EXPIRATION) || 7_200,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
