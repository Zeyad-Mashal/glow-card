import normalizeMembershipType from "@/utils/normalizeMembershipType";

const ROLES_BY_TYPE = {
  Annual: ["father"],
  "Two-Year": ["father"],
  Newlywed: ["father", "mother"],
  Family: ["father", "mother", "child1", "child2"],
};

const hasAtLeastThreeWords = (value) => {
  if (typeof value !== "string") return false;
  return value.trim().split(/\s+/).filter(Boolean).length >= 3;
};

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const isValidSaudiPhone = (value) =>
  /^5\d{8}$/.test(String(value || "").trim().replace(/\s/g, ""));

const getMessages = (lang) => {
  const ar = lang === "ar";
  return {
    nameRequired: ar ? "الاسم مطلوب" : "Name is required",
    nameMinWords: ar
      ? "الاسم يجب أن يكون ثلاث كلمات على الأقل"
      : "Name must contain at least 3 words",
    phoneRequired: ar ? "رقم الجوال مطلوب" : "Phone number is required",
    phoneInvalid: ar
      ? "رقم الجوال يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"
      : "Phone must start with 5 and be 9 digits",
    emailRequired: ar ? "البريد الإلكتروني مطلوب" : "Email is required",
    emailInvalid: ar ? "البريد الإلكتروني غير صحيح" : "Invalid email address",
    genderRequired: ar ? "يرجى اختيار الجنس" : "Please select gender",
    addressRequired: ar ? "العنوان مطلوب" : "Address is required",
    nationalIdRequired: ar ? "رقم الهوية مطلوب" : "National ID is required",
    dobRequired: ar ? "تاريخ الميلاد مطلوب" : "Date of birth is required",
    nationalityRequired: ar ? "الجنسية مطلوبة" : "Nationality is required",
  };
};

const getRoleLabels = (lang) => {
  const ar = lang === "ar";
  return {
    father: ar ? "العضو الأساسي" : "Primary member",
    mother: ar ? "الزوج/الزوجة" : "Spouse",
    child1: ar ? "الطفل الأول" : "Child 1",
    child2: ar ? "الطفل الثاني" : "Child 2",
  };
};

export const validatePerson = (person, lang = "ar") => {
  const m = getMessages(lang);
  const errors = {};
  const name = person?.name?.trim() || "";

  if (!name) errors.name = m.nameRequired;
  else if (!hasAtLeastThreeWords(name)) errors.name = m.nameMinWords;

  const phone = person?.phone?.trim() || "";
  if (!phone) errors.phone = m.phoneRequired;
  else if (!isValidSaudiPhone(phone)) errors.phone = m.phoneInvalid;

  const email = person?.email?.trim() || "";
  if (!email) errors.email = m.emailRequired;
  else if (!isValidEmail(email)) errors.email = m.emailInvalid;

  if (!person?.gender) errors.gender = m.genderRequired;
  if (!person?.address?.trim()) errors.address = m.addressRequired;
  if (!person?.nationalID?.trim()) errors.nationalID = m.nationalIdRequired;
  if (!person?.dateOfBirth) errors.dateOfBirth = m.dobRequired;
  if (!person?.nationality?.trim()) errors.nationality = m.nationalityRequired;

  return errors;
};

export const validateRole = (formData, role, lang = "ar") => {
  const errors = validatePerson(formData?.[role], lang);
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateApplicationForm = (formData, membershipType, lang = "ar") => {
  const type = normalizeMembershipType(membershipType);
  const roles = ROLES_BY_TYPE[type] || ["father"];
  const roleErrors = {};

  roles.forEach((role) => {
    const errors = validatePerson(formData?.[role], lang);
    if (Object.keys(errors).length > 0) {
      roleErrors[role] = errors;
    }
  });

  const firstInvalidRole = roles.find((role) => roleErrors[role]);

  return {
    valid: Object.keys(roleErrors).length === 0,
    roleErrors,
    firstInvalidRole,
    roles,
  };
};

export const buildValidationSummary = (result, lang = "ar") => {
  const labels = getRoleLabels(lang);
  const ar = lang === "ar";
  const lines = [];

  Object.entries(result.roleErrors || {}).forEach(([role, errors]) => {
    const roleLabel = labels[role] || role;
    const fieldCount = Object.keys(errors).length;
    lines.push(
      ar
        ? `• ${roleLabel}: ${fieldCount} حقل/حقول ناقصة أو غير صحيحة`
        : `• ${roleLabel}: ${fieldCount} field(s) missing or invalid`,
    );
  });

  const header = ar
    ? "يرجى إكمال جميع البيانات المطلوبة بشكل صحيح قبل التفعيل:"
    : "Please complete all required fields correctly before activation:";

  return [header, ...lines].join("\n");
};

const Validator = (formData) => {
  if (typeof window === "undefined") return false;
  const type =
    normalizeMembershipType(localStorage.getItem("type")) ||
    localStorage.getItem("type");
  return validateApplicationForm(formData, type).valid;
};

export default Validator;
