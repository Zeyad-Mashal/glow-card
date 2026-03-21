import {
  faGrip,
  faWandMagicSparkles,
  faTooth,
  faBolt,
  faLeaf,
  faEye,
  faDumbbell,
  faSpa,
  faAppleWhole,
  faScissors,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";

/** أيقونة تقريبية حسب اسم التصنيف من الـ API */
export function categoryIconForName(name) {
  if (name === "all") return faGrip;
  const n = (name || "").toLowerCase();
  if (/تجميل|beauty|cosmetic|makeup/i.test(n)) return faWandMagicSparkles;
  if (/أسنان|dental|tooth|teeth|اسنان/i.test(n)) return faTooth;
  if (/ليزر|laser/i.test(n)) return faBolt;
  if (/جلد|derma|skin/i.test(n)) return faLeaf;
  if (/شعر|hair/i.test(n)) return faScissors;
  if (/عين|eye|ophthal/i.test(n)) return faEye;
  if (/تغذية|nutrition|diet/i.test(n)) return faAppleWhole;
  if (/رياضة|sport|fitness|gym|نادي/i.test(n)) return faDumbbell;
  if (/سبا|spa|مساج|massage/i.test(n)) return faSpa;
  if (/طبي|عيادة|medical|clinic|health/i.test(n)) return faStethoscope;
  return faGrip;
}
