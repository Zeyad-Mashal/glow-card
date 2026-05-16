export const PAYMENT_PROVIDER_PRIMARY = "primary";
export const PAYMENT_PROVIDER_TAMARA = "tamara";

export const markPrimaryPaymentContext = () => {
  try {
    localStorage.setItem("pendingPaymentProvider", PAYMENT_PROVIDER_PRIMARY);
    localStorage.removeItem("tamaraOrderId");
    localStorage.removeItem("tamaraCheckoutId");
  } catch {
    /* ignore */
  }
};

export const markTamaraPaymentContext = () => {
  try {
    localStorage.setItem("pendingPaymentProvider", PAYMENT_PROVIDER_TAMARA);
    localStorage.removeItem("invoiceId");
  } catch {
    /* ignore */
  }
};

export const clearPaymentSessionKeys = () => {
  try {
    localStorage.removeItem("pendingPaymentProvider");
    localStorage.removeItem("tamaraOrderId");
    localStorage.removeItem("tamaraCheckoutId");
    localStorage.removeItem("invoiceId");
  } catch {
    /* ignore */
  }
};

export const isTamaraPaymentRecord = (payment) => {
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

  return Boolean(payment?.tamaraOrderId);
};

export const filterPaymentsByProvider = (payments, pendingPaymentProvider) => {
  if (!Array.isArray(payments) || !payments.length) return [];

  if (pendingPaymentProvider === PAYMENT_PROVIDER_TAMARA) {
    const tamaraOnly = payments.filter((payment) => isTamaraPaymentRecord(payment));
    return tamaraOnly.length ? tamaraOnly : payments;
  }

  if (pendingPaymentProvider === PAYMENT_PROVIDER_PRIMARY) {
    const primaryOnly = payments.filter(
      (payment) => !isTamaraPaymentRecord(payment),
    );
    return primaryOnly.length ? primaryOnly : payments;
  }

  return payments;
};
