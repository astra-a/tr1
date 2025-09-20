import { ROUTES } from "./routes";

export const navigation = [
  {
    title: "Home",
    icon: "dashboard",
    href: ROUTES.dashboard,
  },
  {
    title: "Pools",
    icon: "wallet",
    href: ROUTES.pools(),
  },
  {
    title: "Posts",
    icon: "post-think",
    list: [
      {
        title: "Categories",
        // icon: "chain",
        href: ROUTES.categories(),
      },
      // {
      //   title: "Overview",
      //   href: ROUTES.posts,
      // },
      {
        title: "Drafts",
        href: ROUTES.posts_drafts(),
        counter: 0,
      },
      {
        title: "Released",
        href: ROUTES.posts_released(),
        counter: 0,
      },
      // {
      //   title: "Comments",
      //   href: ROUTES.posts_comments,
      // },
      // {
      //   title: "Scheduled",
      //   href: ROUTES.posts_scheduled,
      //   counter: 8,
      // },
    ],
  },
  {
    title: "Media",
    icon: "upload",
    href: ROUTES.media(),
  },
  // {
  //   title: "Customers",
  //   icon: "profile",
  //   list: [
  //     {
  //       title: "Overview",
  //       href: ROUTES.customers,
  //     },
  //     {
  //       title: "Customer list",
  //       href: ROUTES.customers_customerList,
  //     },
  //   ],
  // },
  // {
  //   title: "Shop",
  //   icon: "wallet",
  //   href: ROUTES.shop,
  // },
  // {
  //   title: "Income",
  //   icon: "income",
  //   list: [
  //     {
  //       title: "Earning",
  //       href: ROUTES.income_earning,
  //     },
  //     {
  //       title: "Refunds",
  //       href: ROUTES.income_refunds,
  //       counter: 3,
  //     },
  //     {
  //       title: "Payouts",
  //       href: ROUTES.income_payouts,
  //     },
  //     {
  //       title: "Statements",
  //       href: ROUTES.income_statements,
  //     },
  //   ],
  // },
  // {
  //   title: "Promote",
  //   icon: "promote",
  //   href: ROUTES.promote,
  // },
];

export const navigationUser = [
  // {
  //   title: "My shop",
  //   icon: "bag",
  //   href: ROUTES.shop,
  // },
  {
    title: "Edit Profile",
    icon: "edit-profile",
    href: ROUTES.settings,
  },
  // {
  //   title: "Analytics",
  //   icon: "chart",
  //   href: ROUTES.customers,
  // },
  // {
  //   title: "Affiliate center",
  //   icon: "chain-think",
  //   href: ROUTES.affiliateCenter,
  // },
  // {
  //   title: "Explore creators",
  //   icon: "grid",
  //   href: ROUTES.exploreCreators,
  // },
  // {
  //   title: "Upgrade to Pro",
  //   icon: "star-fill",
  //   href: ROUTES.upgradeToPro,
  // },
];
