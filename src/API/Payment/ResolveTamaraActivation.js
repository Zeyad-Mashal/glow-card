import normalizeMembershipType from "@/utils/normalizeMembershipType";
const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";
const CALLBACK_URL = "https://glow-card.onrender.com/api/v1/payment/callback";
const RETRY_COUNT = 14;
const RETRY_DELAY_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** معرّف سجل الدفع المرسل لـ create — قد لا يكون دائماً `._id` */
const extractPaymentRowId = (payment) =>
  payment?._id ??
  payment?.id ??
  payment?.paymentId ??
  payment?.payId ??
  payment?.payment_id ??
  null;

const resolveProductFromPayment = (payment) =>
  payment?.product?._id ??
  payment?.product?.id ??
  payment?.productId ??
  (typeof payment?.product === "string" ? payment.product : null);

const isTamaraPayment = (payment) => {
  const provider = String(
    payment?.gateway ??
      payment?.provider ??
      payment?.paymentProvider ??
      payment?.method ??
      payment?.paymentMethod ??
      "",
  )
    .trim()
    .toLowerCase();

  if (provider.includes("tamara")) return true;

  return Boolean(
    payment?.tamaraOrderId ??
      payment?.orderId ??
      payment?.order_id ??
      payment?.checkoutId ??
      payment?.checkout_id,
  );
};

const CALLBACK_QUERY_KEYS = [
  "invoiceId",
  "orderId",
  "order_id",
  "checkoutId",
  "checkout_id",
];

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
    payment?.reference,
    payment?.orderReference,
    payment?.merchantReference,
    payment?.externalOrderId,
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

const resolveProductIdFromCallback = (result, pendingProductId) =>
  result?.product?._id ??
  result?.product?.id ??
  result?.productId ??
  (typeof result?.product === "string" ? result.product : null) ??
  pendingProductId;

const resolvePayIdFromCallback = (result) =>
  result?._id ??
  result?.payId ??
  result?.paymentId ??
  result?.payment?._id ??
  result?.data?._id;

const resolveTypeFromCallback = (result, pendingType) =>
  normalizeMembershipType(
    result?.product?.type ?? result?.type ?? result?.cardType ?? pendingType,
  );

const ResolveTamaraActivation = async () => {
  const token = localStorage.getItem("token");
  const lang = localStorage.getItem("lang") || "ar";
  const pendingProductId = localStorage.getItem("pendingActivationProductId");
  const pendingType = normalizeMembershipType(
    localStorage.getItem("pendingActivationType"),
  );
  const tamaraOrderId = localStorage.getItem("tamaraOrderId");
  const tamaraCheckoutId = localStorage.getItem("tamaraCheckoutId");
  console.log("[Tamara][resolver] Start", {
    pendingProductId,
    pendingType,
    tamaraOrderId,
  });

  if (!token) return { next: "/login", ok: false };

  const resolveUsingPaymentCallback = async () => {
    const invoiceId = localStorage.getItem("invoiceId");
    const identifiers = [tamaraOrderId, tamaraCheckoutId].filter(Boolean);
    if (!identifiers.length && invoiceId) {
      identifiers.push(invoiceId);
    }

    for (const identifier of identifiers) {
      for (const key of CALLBACK_QUERY_KEYS) {
        try {
          const response = await fetch(
            `${CALLBACK_URL}?${key}=${encodeURIComponent(identifier)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `glowONW${token}`,
              },
            },
          );
          if (!response.ok) continue;

          const result = await response.json();
          const productId = resolveProductIdFromCallback(result, pendingProductId);
          const payId = resolvePayIdFromCallback(result);
          const type = resolveTypeFromCallback(result, pendingType);

          if (productId && payId) {
            if (type) localStorage.setItem("type", type);
            return {
              ok: true,
              payId,
              type: type || null,
              next: `/application/${encodeURIComponent(productId)}?payId=${encodeURIComponent(payId)}`,
            };
          }
        } catch {
          /* ignore and fallback to notComplete */
        }
      }
    }

    return null;
  };

  const resolveFromPayments = (payments) => {
    const tamaraPayments = payments.filter((payment) => isTamaraPayment(payment));
    const sourcePayments = tamaraPayments.length ? tamaraPayments : payments;
    const orderValue = tamaraOrderId != null ? String(tamaraOrderId) : null;
    const byOrder = orderValue
      ? sortByLatest(
          sourcePayments.filter((payment) =>
            resolveCandidateKeys(payment).includes(orderValue),
          ),
        )[0]
      : null;
    const checkoutValue =
      tamaraCheckoutId != null ? String(tamaraCheckoutId) : null;
    const byCheckout = checkoutValue
      ? sortByLatest(
          sourcePayments.filter((payment) =>
            resolveCandidateKeys(payment).includes(checkoutValue),
          ),
        )[0]
      : null;

    const productValue =
      pendingProductId != null ? String(pendingProductId) : null;
    const byProduct = productValue
      ? sortByLatest(
          sourcePayments.filter((payment) => {
            const pid = resolveProductFromPayment(payment);
            return pid ? String(pid) === productValue : false;
          }),
        )[0]
      : null;

    const latestSource = sortByLatest(sourcePayments)[0];
    const finalSelected =
      byOrder || byCheckout || byProduct || latestSource;
    if (!finalSelected) return null;
    const payRowId = extractPaymentRowId(finalSelected);
    if (!payRowId) return null;

    const productId =
      resolveProductFromPayment(finalSelected) || pendingProductId;
    if (!productId) return null;

    const resolvedType = normalizeMembershipType(
      finalSelected?.product?.type ??
        finalSelected?.type ??
        finalSelected?.cardType ??
        pendingType,
    );

    return {
      ok: true,
      payId: String(payRowId),
      type: resolvedType || null,
      next: `/application/${encodeURIComponent(productId)}?payId=${encodeURIComponent(String(payRowId))}`,
    };
  };

  try {
    const callbackResolved = await resolveUsingPaymentCallback();
    if (callbackResolved) {
      console.log("[Tamara][resolver] Resolved via payment callback", callbackResolved);
      return callbackResolved;
    }

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
    if (pendingProductId) {
      if (pendingType) localStorage.setItem("type", pendingType);
      return {
        ok: true,
        payId: null,
        type: pendingType || null,
        next: `/application/${encodeURIComponent(pendingProductId)}`,
      };
    }
    return { next: "/our_cards", ok: false };
  } catch {
    console.log("[Tamara][resolver] Exception while resolving");
    if (pendingProductId) {
      if (pendingType) localStorage.setItem("type", pendingType);
      return {
        ok: true,
        payId: null,
        type: pendingType || null,
        next: `/application/${encodeURIComponent(pendingProductId)}`,
      };
    }
    return { next: "/our_cards", ok: false };
  }
};

export default ResolveTamaraActivation;
