const CURRENCY = "SAR";
const firedEvents = new Map();

function shouldFire(key, ttlMs = 3000) {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  const last = firedEvents.get(key);
  if (last != null && now - last < ttlMs) return false;
  firedEvents.set(key, now);
  return true;
}

export function parseTrackingPrice(value) {
  if (value == null || value === "") return 0;
  const numeric = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function productPayload({
  contentId,
  contentName,
  value = 0,
  currency = CURRENCY,
  quantity = 1,
}) {
  return { contentId, contentName, value, currency, quantity };
}

export function trackPageView(pagePath) {
  if (typeof window === "undefined") return;
  const path = pagePath || window.location.pathname + window.location.search;
  if (!shouldFire(`pageview:${path}`, 1500)) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "PAGE_VIEW");
  }
  if (window.ttq && typeof window.ttq.page === "function") {
    window.ttq.page();
  }
}

export function trackViewContent(params) {
  const { contentId, contentName, value, currency, quantity } =
    productPayload(params);
  if (!contentId || !shouldFire(`view:${contentId}`, 10000)) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "ViewContent", {
      content_ids: [contentId],
      content_name: contentName,
      content_type: "product",
      value,
      currency,
    });
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "VIEW_CONTENT", {
      item_ids: [contentId],
      description: contentName,
      price: value,
      currency,
    });
  }
  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("ViewContent", {
      contents: [
        {
          content_id: contentId,
          content_name: contentName,
          quantity,
          price: value,
        },
      ],
      value,
      currency,
    });
  }
}

export function trackAddToCart(params) {
  const { contentId, contentName, value, currency, quantity } =
    productPayload(params);
  if (!contentId || !shouldFire(`cart:${contentId}`, 5000)) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "AddToCart", {
      content_ids: [contentId],
      content_name: contentName,
      content_type: "product",
      value,
      currency,
    });
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "ADD_CART", {
      item_ids: [contentId],
      description: contentName,
      price: value,
      currency,
      number_items: quantity,
    });
  }
  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("AddToCart", {
      contents: [
        {
          content_id: contentId,
          content_name: contentName,
          quantity,
          price: value,
        },
      ],
      value,
      currency,
    });
  }
}

export function trackInitiateCheckout(params) {
  const { contentId, contentName, value, currency, quantity } =
    productPayload(params);
  if (!shouldFire(`checkout:${contentId || "default"}`, 8000)) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", {
      content_ids: contentId ? [contentId] : undefined,
      content_name: contentName,
      num_items: quantity,
      value,
      currency,
    });
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "START_CHECKOUT", {
      item_ids: contentId ? [contentId] : undefined,
      description: contentName,
      price: value,
      currency,
      number_items: quantity,
    });
  }
  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("InitiateCheckout", {
      contents: contentId
        ? [
            {
              content_id: contentId,
              content_name: contentName,
              quantity,
              price: value,
            },
          ]
        : undefined,
      value,
      currency,
    });
  }
}

export function trackAddPaymentInfo(params) {
  const { contentId, contentName, value, currency, quantity } =
    productPayload(params);
  if (!shouldFire(`payment_info:${contentId || "default"}`, 5000)) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "AddPaymentInfo", {
      content_ids: contentId ? [contentId] : undefined,
      content_name: contentName,
      value,
      currency,
    });
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "ADD_BILLING", {
      item_ids: contentId ? [contentId] : undefined,
      price: value,
      currency,
      number_items: quantity,
    });
  }
  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("AddPaymentInfo", {
      contents: contentId
        ? [
            {
              content_id: contentId,
              content_name: contentName,
              quantity,
              price: value,
            },
          ]
        : undefined,
      value,
      currency,
    });
  }
}

export function trackPurchase(params) {
  const { contentId, contentName, value, currency, quantity, orderId } = {
    ...productPayload(params),
    orderId: params?.orderId,
  };
  const dedupeKey = `purchase:${orderId || contentId || "order"}`;
  if (!shouldFire(dedupeKey, 120000)) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "Purchase", {
      content_ids: contentId ? [contentId] : undefined,
      content_name: contentName,
      value,
      currency,
      num_items: quantity,
    });
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "PURCHASE", {
      transaction_id: orderId,
      item_ids: contentId ? [contentId] : undefined,
      description: contentName,
      price: value,
      currency,
      number_items: quantity,
    });
  }
  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("CompletePayment", {
      contents: contentId
        ? [
            {
              content_id: contentId,
              content_name: contentName,
              quantity,
              price: value,
            },
          ]
        : undefined,
      value,
      currency,
    });
  }
}

export function trackCompleteRegistration() {
  if (!shouldFire("registration", 10000)) return;

  if (typeof window.fbq === "function") {
    window.fbq("track", "CompleteRegistration");
  }
  if (typeof window.snaptr === "function") {
    window.snaptr("track", "SIGN_UP");
  }
  if (window.ttq && typeof window.ttq.track === "function") {
    window.ttq.track("CompleteRegistration");
  }
}

export function getCheckoutContextFromStorage(searchParams) {
  const contentId =
    searchParams?.get("id") ||
    (typeof window !== "undefined"
      ? localStorage.getItem("pendingActivationProductId")
      : null);

  const contentName =
    typeof window !== "undefined" ? localStorage.getItem("type") : null;

  const value =
    typeof window !== "undefined"
      ? parseTrackingPrice(localStorage.getItem("price"))
      : 0;

  return { contentId, contentName, value, currency: CURRENCY, quantity: 1 };
}
