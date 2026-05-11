/**
 * الأسماء الكنسية في النظام والـ API:
 * Classic  → Annual
 * Premium  → Two-Year
 * Couples  → Newlywed
 * Family   → Family
 */
const TYPE_ALIASES = {
  annual: "Annual",
  yearly: "Annual",
  oneyear: "Annual",
  oneyearmembership: "Annual",
  "سنوية": "Annual",

  twoyear: "Two-Year",
  twoyearmembership: "Two-Year",
  "twoyears": "Two-Year",
  "two-year": "Two-Year",
  "two year": "Two-Year",
  "سنتين": "Two-Year",
  "سنتينmembership": "Two-Year",
  "سنتينعضوية": "Two-Year",

  /** Classic — الكنسي Annual */
  classic: "Annual",
  classical: "Annual",
  "كلاسيك": "Annual",
  "الكلاسيك": "Annual",
  "عضويهكلاسيك": "Annual",
  "عضويةكلاسيك": "Annual",

  /** Premium — الكنسي Two-Year */
  premium: "Two-Year",
  premiummembership: "Two-Year",
  "بريميوم": "Two-Year",
  "البريميوم": "Two-Year",
  "برميم": "Two-Year",
  "برميوم": "Two-Year",
  "عضويهبريميوم": "Two-Year",
  "عضويةبريميوم": "Two-Year",

  newlywed: "Newlywed",
  couple: "Newlywed",
  couples: "Newlywed",
  spouse: "Newlywed",
  spouses: "Newlywed",
  "classiccouples": "Newlywed",
  "premiumcouples": "Newlywed",
  classiccouple: "Newlywed",
  premiumcouple: "Newlywed",
  "زوج": "Newlywed",
  "زوجين": "Newlywed",
  "ثنائي": "Newlywed",
  "ثنائيه": "Newlywed",
  "ثنائية": "Newlywed",
  "أزواج": "Newlywed",
  "ازواج": "Newlywed",

  family: "Family",
  families: "Family",
  "عائلة": "Family",
  "العائلة": "Family",
  "عائله": "Family",
};

const canonicalValues = new Set(["Annual", "Two-Year", "Newlywed", "Family"]);

const normalizeKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");

const normalizeMembershipType = (value) => {
  if (!value) return "";
  if (canonicalValues.has(value)) return value;

  const key = normalizeKey(value);
  return TYPE_ALIASES[key] || value;
};

export default normalizeMembershipType;
