import normalizeMembershipType from "@/utils/normalizeMembershipType";
const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";
const RETRY_COUNT = 8;
const RETRY_DELAY_MS = 1300;

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

const isNotCompletedPayment = (payment) => {
  const status = String(
    payment?.status ??
      payment?.paymentStatus ??
      payment?.state ??
      payment?.payment_state ??
      "",
  ).toLowerCase();

  return !["completed", "paid", "success", "approved", "done"].includes(status);
};

const ResolveTamaraActivation = async () => {
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("lang") || "ar";
  const pendingProductId = localStorage.getItem("pendingActivationProductId");
  const pendingType = normalizeMembershipType(
    localStorage.getItem("pendingActivationType"),
  );
  const tamaraOrderId = localStorage.getItem("tamaraOrderId");
  console.log("[Tamara][resolver] Start", {
    pendingProductId,
    pendingType,
    tamaraOrderId,
  });

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

    const latestOpenPayment = sortByLatest(
      payments.filter((payment) => isNotCompletedPayment(payment)),
    )[0];

    const latestAnyPayment = sortByLatest(payments)[0];

    const selected = byOrder || byProduct;
    const finalSelected = selected || latestOpenPayment || latestAnyPayment;
    if (!finalSelected?._id) return null;

    const productId =
      resolveProductFromPayment(finalSelected) || pendingProductId;
    if (!productId) return null;

    const resolvedType = normalizeMembershipType(
      pendingType ??
        finalSelected?.product?.type ??
        finalSelected?.type ??
        finalSelected?.cardType,
    );

    return {
      ok: true,
      payId: finalSelected._id,
      type: resolvedType || null,
      next: `/application/${encodeURIComponent(productId)}?payId=${encodeURIComponent(finalSelected._id)}`,
    };
  };

  try {
    for (let attempt = 0; attempt < RETRY_COUNT; attempt += 1) {
      console.log("[Tamara][resolver] Fetch notComplete attempt", {
        attempt: attempt + 1,
        maxAttempts: RETRY_COUNT,
      });
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
      console.log("[Tamara][resolver] notComplete response", {
        paymentsCount: payments.length,
      });
      if (payments.length) {
        const resolved = resolveFromPayments(payments);
        if (resolved) {
          console.log("[Tamara][resolver] Resolved activation payload", resolved);
          if (resolved.type) {
            localStorage.setItem("type", resolved.type);
          }
          return resolved;
        }
      }

      if (attempt < RETRY_COUNT - 1) {
        await sleep(RETRY_DELAY_MS);
      }
    }
    console.log("[Tamara][resolver] Failed to resolve after retries");
    return { next: "/our_cards", ok: false };
  } catch {
    console.log("[Tamara][resolver] Exception while resolving");
    return { next: "/our_cards", ok: false };
  }
};

export default ResolveTamaraActivation;
