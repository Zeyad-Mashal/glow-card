"use client";
import React, { useState, useEffect, useMemo } from "react";
import "./application.css";
import { useSearchParams, useParams } from "next/navigation";
import ApplicationApi from "@/API/Application/ApplicationApi.api";
import Validator from "./Validator";
import { useRouter } from "next/navigation";
import { Lang } from "@/Lang/lang";

const STEP_TITLE_KEYS = [
  "appFormStepFather",
  "appFormStepMother",
  "appFormStepChild1",
  "appFormStepChild2",
];

const ApplicationClient = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(5);
  const [type, setType] = useState("");
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "ar";
    return localStorage.getItem("lang") || "ar";
  });

  const searchParams = useSearchParams();
  const payId = searchParams.get("payId");
  const { productId } = useParams();

  const langValue = useMemo(() => Lang[lang] ?? Lang.ar, [lang]);

  useEffect(() => {
    const v = localStorage.getItem("lang") || "ar";
    setLang(v);
    const dir = v === "ar" ? "rtl" : "ltr";
    document.body.style.direction = dir;
    document.documentElement.lang = v === "ar" ? "ar" : "en";
  }, []);

  useEffect(() => {
    const storedType = localStorage.getItem("type");
    if (!storedType) {
      router.push("/");
    } else {
      setType(storedType);
    }
  }, [router]);

  useEffect(() => {
    if (!showModal) return;
    setRedirectSeconds(5);
    const redirectPath = `/card?id=${encodeURIComponent(productId)}`;
    const countdown = window.setInterval(() => {
      setRedirectSeconds((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    const timer = window.setTimeout(() => {
      router.push(redirectPath);
    }, 5000);

    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(timer);
    };
  }, [showModal, router, productId]);

  const [step, setStep] = useState(0);
  const [animation, setAnimation] = useState("fade-in");

  const [familyData, setFamilyData] = useState({
    father: {},
    mother: {},
    child1: {},
    child2: {},
  });
  const [nameErrors, setNameErrors] = useState({});

  const hasAtLeastThreeWords = (value) => {
    if (typeof value !== "string") return false;
    const words = value.trim().split(/\s+/).filter(Boolean);
    return words.length >= 3;
  };

  const nameErrorText =
    lang === "ar"
      ? "الاسم يجب أن يكون ثلاث كلمات على الأقل."
      : "Name must contain at least 3 words.";

  const handleChange = (e, role) => {
    const { name, value } = e.target;
    setFamilyData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [name]: value,
      },
    }));

    if (name === "name") {
      setNameErrors((prev) => ({
        ...prev,
        [role]:
          value.trim() && !hasAtLeastThreeWords(value) ? nameErrorText : "",
      }));
    }
  };

  const handleNext = () => {
    const currentRole = roles[step];
    console.log(
      `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Data:`,
      familyData[currentRole]
    );

    document.querySelectorAll(".input_field").forEach((input) => {
      input.value = "";
    });
    setAnimation("fade-out");
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setAnimation("fade-in");
    }, 500);
  };

  const handleBack = () => {
    setAnimation("fade-out");
    setTimeout(() => {
      setStep((prev) => prev - 1);
      setAnimation("fade-in");
    }, 500);
  };

  const handlePayment = () => {
    const isValidator = Validator(familyData);
    if (!isValidator) {
      const requiredRolesByType = {
        Annual: ["father"],
        "Two-Year": ["father"],
        Newlywed: ["father", "mother"],
        Family: ["father", "mother", "child1", "child2"],
      };
      const roleOrder = requiredRolesByType[type] || ["father"];
      const invalidRole = roleOrder.find((role) => {
        const currentName = familyData?.[role]?.name || "";
        return currentName && !hasAtLeastThreeWords(currentName);
      });

      if (invalidRole) {
        const roleIndex = roles.indexOf(invalidRole);
        if (roleIndex >= 0) {
          setStep(roleIndex);
        }
        setNameErrors((prev) => ({
          ...prev,
          [invalidRole]: nameErrorText,
        }));
      }
      return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }

    let data = {};
    if (type === "Annual" || type === "Two-Year") {
      data = { ...familyData.father };
      data.spouse = {};
      data.members = [];
    } else if (type === "Newlywed") {
      data = { ...familyData.father };
      data.spouse = { ...familyData.mother };
      data.spouse.relationship = "wife";
    } else {
      data = { ...familyData.father };
      data.members = [];
      data.members[0] = { ...familyData.mother };
      data.members[0].relationship = "wife";
      data.members[1] = { ...familyData.child1 };
      data.members[1].relationship = "son";
      data.members[2] = { ...familyData.child2 };
      data.members[2].relationship = "son";
    }
    data.type = type;
    ApplicationApi(setLoading, setError, data, productId, setShowModal, payId);
  };

  const roles = ["father", "mother", "child1", "child2"];

  const renderForm = (role, title) => (
    <div className={`application_form ${animation}`}>
      <h2>{title}</h2>
      <label>{langValue.appLabelName}</label>
      <input
        className="input_field"
        type="text"
        placeholder={langValue.appPhName}
        name="name"
        onChange={(e) => handleChange(e, role)}
      />
      {nameErrors[role] && <p className="input_error">{nameErrors[role]}</p>}
      <label>{langValue.appLabelPhone}</label>
      <input
        className="input_field"
        type="text"
        placeholder={langValue.appPhPhone}
        name="phone"
        onChange={(e) => handleChange(e, role)}
      />
      <label>{langValue.appLabelEmail}</label>
      <input
        className="input_field"
        type="text"
        placeholder={langValue.appPhEmail}
        name="email"
        onChange={(e) => handleChange(e, role)}
      />
      <label>{langValue.appLabelGender}</label>
      <select name="gender" onChange={(e) => handleChange(e, role)}>
        <option value="">{langValue.appGenderPlaceholder}</option>
        <option value="Male">{langValue.appGenderMale}</option>
        <option value="Female">{langValue.appGenderFemale}</option>
      </select>
      <div className="form1">
        <div className="form1_content">
          <label>{langValue.appLabelAddress}</label>
          <input
            className="input_field"
            type="text"
            placeholder={langValue.appPhAddress}
            name="address"
            onChange={(e) => handleChange(e, role)}
          />
        </div>
        <div className="form1_content">
          <label>{langValue.appLabelNationalId}</label>
          <input
            className="input_field"
            type="text"
            placeholder={langValue.appPhNationalId}
            name="nationalID"
            onChange={(e) => handleChange(e, role)}
          />
        </div>
      </div>
      <div className="form1">
        <div className="form1_content">
          <label>{langValue.appLabelDob}</label>
          <input
            className="input_field"
            type="date"
            name="dateOfBirth"
            onChange={(e) => handleChange(e, role)}
          />
        </div>
      </div>
      <label>{langValue.appLabelNationality}</label>
      <input
        className="input_field"
        type="text"
        placeholder={langValue.appPhNationality}
        name="nationality"
        onChange={(e) => handleChange(e, role)}
      />
      {error}
    </div>
  );

  const stepTitle =
    langValue[STEP_TITLE_KEYS[step]] ?? langValue.appFormStepFather;

  return (
    <div className="application">
      <div className="appliaction_container">
        <h1>{langValue.appPageTitle}</h1>
        <h2>{langValue.appPageSubtitle}</h2>

        {type && renderForm(roles[step], stepTitle)}

        {type === "Family" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            {step > 0 && (
              <button onClick={handleBack} className="back_button">
                {langValue.appBtnBack}
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext} className="back_button">
                {langValue.appBtnNext}
              </button>
            ) : (
              <button onClick={handlePayment} className="back_button">
                {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
              </button>
            )}
          </div>
        )}
        {type === "Annual" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={handlePayment} className="back_button">
              {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
            </button>
          </div>
        )}
        {type === "Two-Year" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={handlePayment} className="back_button">
              {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
            </button>
          </div>
        )}
        {type === "Newlywed" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            {step > 0 && (
              <button onClick={handleBack} className="back_button">
                {langValue.appBtnBack}
              </button>
            )}
            {step < 1 ? (
              <button onClick={handleNext} className="back_button">
                {langValue.appBtnNext}
              </button>
            ) : (
              <button onClick={handlePayment} className="back_button">
                {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal_content activation_success_modal">
            <div className="activation_success_icon">✓</div>
            <h2>
              {lang === "ar" ? "تم التفعيل بنجاح" : "Activation Completed"}
            </h2>
            <p>
              {lang === "ar"
                ? "تم تفعيل البطاقة وسيتم تحويلك إلى صفحة تفاصيل البطاقة."
                : "Your card is activated. You will be redirected to the card details page."}
            </p>
            <p className="activation_redirect_countdown">
              {lang === "ar"
                ? `سيتم التحويل خلال ${redirectSeconds} ثوانٍ...`
                : `Redirecting in ${redirectSeconds} seconds...`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationClient;
