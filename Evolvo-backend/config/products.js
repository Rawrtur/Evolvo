const PRODUCTS = {
  PREMIUM_WEEKLY: {
    id: "evolvo_premium_weekly",
    entitlement: "premium",
    interval: "week",
  },

  PREMIUM_MONTHLY: {
    id: "evolvo_premium_monthly",
    entitlement: "premium",
    interval: "month",
  },

  PREMIUM_YEARLY: {
    id: "evolvo_premium_yearly",
    entitlement: "premium",
    interval: "year",
  },
};

export const PREMIUM_PRODUCT_IDS = Object.values(PRODUCTS).map(
  (product) => product.id
);

export default PRODUCTS;