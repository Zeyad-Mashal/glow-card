const Validator = (formData) => {
  let type = null;

  // تحقق إذا كانت البيئة هي بيئة المتصفح (client-side)
  if (typeof window !== "undefined") {
    type = localStorage.getItem("type");
  }

  if (!type) return false; // إذا كانت `type` غير موجودة، نعيد false

  // باقي التحقق من البيانات
  if (type == "Annual" || type == "Two-Year") {
    const { father } = formData;
    const {
      name,
      phone,
      email,
      address,
      gender,
      nationalID,
      dateOfBirth,
      nationality,
    } = father;
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !gender ||
      !nationalID ||
      !dateOfBirth ||
      !nationality
    ) {
      return false;
    }
  }

  if (type == "Newlywed") {
    const { father, mother } = formData;
    const {
      name,
      phone,
      email,
      address,
      gender,
      nationalID,
      dateOfBirth,
      nationality,
    } = father;
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !gender ||
      !nationalID ||
      !dateOfBirth ||
      !nationality
    ) {
      return false;
    }
    if (
      !mother.name ||
      !mother.phone ||
      !email.email ||
      !mother.address ||
      !mother.gender ||
      !mother.nationalID ||
      !mother.dateOfBirth ||
      !mother.nationality
    ) {
      return false;
    }
  }

  if (type == "Family") {
    const { father, mother, child1, child2 } = formData;
    const {
      name,
      phone,
      email,
      address,
      gender,
      nationalID,
      dateOfBirth,
      nationality,
    } = father;
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !gender ||
      !nationalID ||
      !dateOfBirth ||
      !nationality
    ) {
      return false;
    }
    if (
      !mother.name ||
      !mother.phone ||
      !mother.email ||
      !mother.address ||
      !mother.gender ||
      !mother.nationalID ||
      !mother.dateOfBirth ||
      !mother.nationality
    ) {
      return false;
    }
    if (
      !child1.name ||
      !child1.phone ||
      !child1.email ||
      !child1.address ||
      !child1.gender ||
      !child1.nationalID ||
      !child1.dateOfBirth ||
      !child1.nationality
    ) {
      return false;
    }
    if (
      !child2.name ||
      !child2.phone ||
      !child2.email ||
      !child2.address ||
      !child2.gender ||
      !child2.nationalID ||
      !child2.dateOfBirth ||
      !child2.nationality
    ) {
      return false;
    }
  }

  return true;
};

export default Validator;
