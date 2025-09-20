export const ROUTE_PREFIX = "/dashboard";

export const ROUTES = {
  dashboard: ROUTE_PREFIX,

  login: `${ROUTE_PREFIX}/login`,
  login_action: `${ROUTE_PREFIX}/login/action`,
  logout_action: `${ROUTE_PREFIX}/logout/action`,

  // posts: `${ROUTE_PREFIX}/posts`,
  posts: `${ROUTE_PREFIX}/posts/released`,
  posts_drafts: (keywords?: string, page?: number) =>
    withQuery(`${ROUTE_PREFIX}/posts/drafts`, { keywords, page }),
  posts_released: (keywords?: string, page?: number) =>
    withQuery(`${ROUTE_PREFIX}/posts/released`, { keywords, page }),
  posts_comments: `${ROUTE_PREFIX}/posts/comments`,
  // posts_scheduled: `${ROUTE_PREFIX}/posts/scheduled`,
  posts_new: `${ROUTE_PREFIX}/posts/new`,
  posts_edit: (id: string) => `${ROUTE_PREFIX}/posts/${id}/edit`,
  posts_new_action: `${ROUTE_PREFIX}/posts/new/action`,
  posts_edit_action: (id: string) => `${ROUTE_PREFIX}/posts/${id}/edit/action`,
  posts_delete_action: (id: string) =>
    `${ROUTE_PREFIX}/posts/${id}/delete/action`,
  posts_publish_action: (id: string) =>
    `${ROUTE_PREFIX}/posts/${id}/publish/action`,
  posts_unpublish_action: (id: string) =>
    `${ROUTE_PREFIX}/posts/${id}/unpublish/action`,
  posts_pin_action: (id: string) => `${ROUTE_PREFIX}/posts/${id}/pin/action`,
  posts_unpin_action: (id: string) =>
    `${ROUTE_PREFIX}/posts/${id}/unpin/action`,
  posts_operate_action: (
    id: string,
    operate: "edit" | "delete" | "publish" | "unpublish" | "pin" | "unpin",
  ) => `${ROUTE_PREFIX}/posts/${id}/${operate}/action`,
  posts_batch_delete_action: `${ROUTE_PREFIX}/posts/batch/delete/action`,
  posts_batch_publish_action: `${ROUTE_PREFIX}/posts/batch/publish/action`,
  posts_batch_unpublish_action: `${ROUTE_PREFIX}/posts/batch/unpublish/action`,
  posts_batch_operate_action: (operate: "delete" | "publish" | "unpublish") =>
    `${ROUTE_PREFIX}/posts/batch/${operate}/action`,

  categories: (keywords?: string, page?: number) =>
    withQuery(`${ROUTE_PREFIX}/categories`, { keywords, page }),
  categories_new: `${ROUTE_PREFIX}/categories/new`,
  categories_edit: (id: string) => `${ROUTE_PREFIX}/categories/${id}/edit`,
  categories_new_action: `${ROUTE_PREFIX}/categories/new/action`,
  categories_edit_action: (id: string) =>
    `${ROUTE_PREFIX}/categories/${id}/edit/action`,
  categories_delete_action: (id: string) =>
    `${ROUTE_PREFIX}/categories/${id}/delete/action`,
  categories_batch_delete_action: `${ROUTE_PREFIX}/categories/batch/delete/action`,

  media: (keywords?: string, page?: number) =>
    withQuery(`${ROUTE_PREFIX}/media`, { keywords, page }),
  media_new: `${ROUTE_PREFIX}/media/new`,
  media_edit: (id: string) => `${ROUTE_PREFIX}/media/${id}/edit`,
  media_new_action: `${ROUTE_PREFIX}/media/new/action`,
  media_edit_action: (id: string) => `${ROUTE_PREFIX}/media/${id}/edit/action`,
  media_delete_action: (id: string) =>
    `${ROUTE_PREFIX}/media/${id}/delete/action`,
  media_batch_delete_action: `${ROUTE_PREFIX}/media/batch/delete/action`,

  pools: (status?: string, keywords?: string, page?: number) =>
    withQuery(`${ROUTE_PREFIX}/pools`, { status, keywords, page }),
  pools_new: `${ROUTE_PREFIX}/pools/new`,
  pools_details: (id: string) => `${ROUTE_PREFIX}/pools/${id}/details`,
  pools_new_action: `${ROUTE_PREFIX}/pools/new/action`,
  pools_operate_action: (id: string, operate: "hide" | "show") =>
    `${ROUTE_PREFIX}/pools/${id}/${operate}/action`,

  customers: `${ROUTE_PREFIX}/customers`,
  customers_customerList: `${ROUTE_PREFIX}/customers/customer-list`,
  customers_customerList_details: `${ROUTE_PREFIX}/customers/customer-list/details`,

  shop: `${ROUTE_PREFIX}/shop`,
  shop_details: `${ROUTE_PREFIX}/shop/details`,

  income_earning: `${ROUTE_PREFIX}/income/earning`,
  income_refunds: `${ROUTE_PREFIX}/income/refunds`,
  income_refunds_details: `${ROUTE_PREFIX}/income/refunds/details`,
  income_payouts: `${ROUTE_PREFIX}/income/payouts`,
  income_statements: `${ROUTE_PREFIX}/income/statements`,

  promote: `${ROUTE_PREFIX}/promote`,
  settings: `${ROUTE_PREFIX}/settings`,
  affiliateCenter: `${ROUTE_PREFIX}/affiliate-center`,
  exploreCreators: `${ROUTE_PREFIX}/explore-creators`,
  upgradeToPro: `${ROUTE_PREFIX}/upgrade-to-pro`,
  messages: `${ROUTE_PREFIX}/messages`,
  notifications: `${ROUTE_PREFIX}/notifications`,
};

export const withQuery = (
  path: string,
  params?: { [key: string]: string | number | undefined | null },
) => {
  if (!params) return path;

  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `${encodeURIComponent(k)}=${encodeURIComponent(v as string | number)}`,
    )
    .join("&");

  return query ? `${path}?${query}` : path;
};
