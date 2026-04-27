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

  newlywed: "Newlywed",
  couple: "Newlywed",
  couples: "Newlywed",
  spouse: "Newlywed",
  "زوج": "Newlywed",
  "زوجين": "Newlywed",
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
