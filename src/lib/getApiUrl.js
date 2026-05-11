const DEFAULT_ORIGIN = "https://glow-card.onrender.com";

function normalizeOrigin(value) {
  if (!value || typeof value !== "string") return null;
  return value.replace(/\/+$/, "") || null;
}

/**
 * @param {string} path مثال: `/api/v1/category/get`
 * @returns {string} عنوان كامل؛ يمكن ضبطه عبر NEXT_PUBLIC_API_BASE_URL
 */
export function getApiUrl(path) {
  const fromEnv =
    typeof process !== "undefined"
      ? normalizeOrigin(process.env.NEXT_PUBLIC_API_BASE_URL)
      : null;
  const origin = fromEnv ?? DEFAULT_ORIGIN;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}
