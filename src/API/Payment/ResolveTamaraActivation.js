const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";
const RETRY_COUNT = 5;
const RETRY_DELAY_MS = 1200;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveProductFromPayment = (payment) =>
  payment?.product?._id ??
  payment?.product?.id ??
  payment?.productId ??
  (typeof payment?.product === "string" ? payment.product : null);

const resolveCandidateKeys = (payment) =>
  [
    payment?._id,
    payment?.orderId,
    payment?.order_id,
    payment?.paymentId,
    payment?.invoiceId,
    payment?.invoice_id,
    payment?.invoiceNumber,
    payment?.payId,
    payment?.tamaraOrderId,
    payment?.checkoutId,
    payment?.checkout_id,
  ]
    .filter((value) => value != null)
    .map((value) => String(value));

const sortByLatest = (list) =>
  [...list].sort((a, b) => {
    const aTime = new Date(a?.createdAt ?? a?.updatedAt ?? 0).getTime();
    const bTime = new Date(b?.createdAt ?? b?.updatedAt ?? 0).getTime();
    if (aTime !== bTime) return bTime - aTime;
    return String(b?._id || "").localeCompare(String(a?._id || ""));
  });

const ResolveTamaraActivation = async () => {
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("lang") || "ar";
  const pendingProductId = localStorage.getItem("pendingActivationProductId");
  const pendingType = localStorage.getItem("pendingActivationType");
  const tamaraOrderId = localStorage.getItem("tamaraOrderId");

  if (!token) return { next: "/login", ok: false };

  const resolveFromPayments = (payments) => {
    const orderValue = tamaraOrderId != null ? String(tamaraOrderId) : null;
    const byOrder = orderValue
      ? sortByLatest(
          payments.filter((payment) =>
            resolveCandidateKeys(payment).includes(orderValue),
          ),
        )[0]
      : null;

    const productValue =
      pendingProductId != null ? String(pendingProductId) : null;
    const byProduct = productValue
      ? sortByLatest(
          payments.filter((payment) => {
            const pid = resolveProductFromPayment(payment);
            return pid ? String(pid) === productValue : false;
          }),
        )[0]
      : null;

    const selected = byOrder || byProduct;
    if (!selected?._id) return null;

    const productId = resolveProductFromPayment(selected) || pendingProductId;
    if (!productId) return null;

    return {
      ok: true,
      next: `/application/${encodeURIComponent(productId)}?payId=${encodeURIComponent(selected._id)}`,
    };
  };

  try {
    for (let attempt = 0; attempt < RETRY_COUNT; attempt += 1) {
    const response = await fetch(NOT_COMPLETE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `glowONW${token}`,
        "accept-language": lang,
      },
    });

      if (!response.ok) {
        if (attempt < RETRY_COUNT - 1) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        return { next: "/our_cards", ok: false };
      }

    const result = await response.json();
    const payments = Array.isArray(result?.payments) ? result.payments : [];
      if (payments.length) {
        const resolved = resolveFromPayments(payments);
        if (resolved) {
          if (pendingType) {
            localStorage.setItem("type", pendingType);
          }
          return resolved;
        }
      }

      if (attempt < RETRY_COUNT - 1) {
        await sleep(RETRY_DELAY_MS);
      }
    }
    return { next: "/our_cards", ok: false };
  } catch {
    return { next: "/our_cards", ok: false };
  }
};

export default ResolveTamaraActivation;
