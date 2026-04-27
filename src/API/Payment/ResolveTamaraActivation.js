const NOT_COMPLETE_URL = "https://glow-card.onrender.com/api/v1/card/notComplete";

const resolveProductFromPayment = (payment) =>
  payment?.product?._id ??
  payment?.product?.id ??
  payment?.productId ??
  (typeof payment?.product === "string" ? payment.product : null);

const resolveCandidateKeys = (payment) =>
  [
    payment?._id,
    payment?.orderId,
    payment?.paymentId,
    payment?.invoiceId,
    payment?.invoice_id,
    payment?.invoiceNumber,
    payment?.payId,
    payment?.tamaraOrderId,
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

  try {
    const response = await fetch(NOT_COMPLETE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `glowONW${token}`,
        "accept-language": lang,
      },
    });

    if (!response.ok) return { next: "/our_cards", ok: false };

    const result = await response.json();
    const payments = Array.isArray(result?.payments) ? result.payments : [];
    if (!payments.length) return { next: "/our_cards", ok: false };

    const orderValue = tamaraOrderId != null ? String(tamaraOrderId) : null;
    const byOrder = orderValue
      ? payments.find((payment) =>
          resolveCandidateKeys(payment).includes(orderValue),
        )
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
    if (!selected?._id) return { next: "/our_cards", ok: false };

    const productId = resolveProductFromPayment(selected) || pendingProductId;
    if (!productId) return { next: "/our_cards", ok: false };

    if (pendingType) {
      localStorage.setItem("type", pendingType);
    }

    return {
      ok: true,
      next: `/application/${encodeURIComponent(productId)}?payId=${encodeURIComponent(selected._id)}`,
    };
  } catch {
    return { next: "/our_cards", ok: false };
  }
};

export default ResolveTamaraActivation;
