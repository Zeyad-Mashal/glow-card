"use client";
import React, { useState, useEffect, useMemo } from "react";
import "./application.css";
import { useSearchParams, useParams } from "next/navigation";
import ApplicationApi from "@/API/Application/ApplicationApi.api";
import {
  validateApplicationForm,
  validateRole,
  buildValidationSummary,
} from "./Validator";
import { useRouter } from "next/navigation";
import { Lang } from "@/Lang/lang";
import normalizeMembershipType from "@/utils/normalizeMembershipType";

const STEP_TITLE_KEYS = [
  "appFormStepFather",
  "appFormStepMother",
  "appFormStepChild1",
  "appFormStepChild2",
];

const ROLES = ["father", "mother", "child1", "child2"];

const ApplicationClient = () => {
  const router = useRouter();
  const NOT_COMPLETE_URL =
    "https://glow-card.onrender.com/api/v1/card/notComplete";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(5);
  const [type, setType] = useState("");
  const [resolvingPayMeta, setResolvingPayMeta] = useState(true);
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
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const syncTypeAndProductFromPayId = async () => {
      const token = localStorage.getItem("token");
      const langLocal = localStorage.getItem("lang") || "ar";
      const storedType = normalizeMembershipType(localStorage.getItem("type"));

      if (storedType) {
        setType(storedType);
        localStorage.setItem("type", storedType);
      }

      if (!token || !payId) {
        if (!storedType) {
          router.push("/");
        }
        setResolvingPayMeta(false);
        return;
      }

      try {
        const response = await fetch(NOT_COMPLETE_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `glowONW${token}`,
            "accept-language": langLocal,
          },
        });

        if (!response.ok) {
          setResolvingPayMeta(false);
          return;
        }

        const result = await response.json();
        const payments = Array.isArray(result?.payments) ? result.payments : [];
        const payValue = String(payId);
        const selectedPayment = payments.find((payment) => {
          const keys = [
            payment?._id,
            payment?.id,
            payment?.paymentId,
            payment?.payId,
            payment?.payment_id,
            payment?.orderId,
            payment?.order_id,
            payment?.tamaraOrderId,
            payment?.checkoutId,
            payment?.checkout_id,
          ]
            .filter((v) => v != null)
            .map((v) => String(v));
          return keys.includes(payValue);
        });

        if (!selectedPayment) {
          setResolvingPayMeta(false);
          return;
        }

        const payType = normalizeMembershipType(
          selectedPayment?.product?.type ??
            selectedPayment?.type ??
            selectedPayment?.cardType,
        );
        const payProductId =
          selectedPayment?.product?._id ??
          selectedPayment?.product?.id ??
          selectedPayment?.productId ??
          (typeof selectedPayment?.product === "string"
            ? selectedPayment.product
            : null);

        if (payType) {
          setType(payType);
          localStorage.setItem("type", payType);
        }

        if (payProductId && String(payProductId) !== String(productId)) {
          router.replace(
            `/application/${encodeURIComponent(payProductId)}?payId=${encodeURIComponent(payId)}`,
          );
          return;
        }
      } catch {
        /* ignore */
      } finally {
        setResolvingPayMeta(false);
      }
    };

    syncTypeAndProductFromPayId();
  }, [router, payId, productId]);

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationSummary, setValidationSummary] = useState("");

  const fieldErrorClass = (role, fieldName) =>
    fieldErrors[role]?.[fieldName]
      ? "input_field input_field_error"
      : "input_field";

  const renderFieldError = (role, fieldName) =>
    fieldErrors[role]?.[fieldName] ? (
      <p className="input_error">{fieldErrors[role][fieldName]}</p>
    ) : null;

  const clearRoleFieldError = (role, fieldName) => {
    setFieldErrors((prev) => {
      if (!prev[role]?.[fieldName]) return prev;
      const nextRoleErrors = { ...prev[role] };
      delete nextRoleErrors[fieldName];
      const next = { ...prev };
      if (Object.keys(nextRoleErrors).length === 0) {
        delete next[role];
      } else {
        next[role] = nextRoleErrors;
      }
      return next;
    });
  };

  const handleChange = (e, role) => {
    const { name, value } = e.target;
    setFamilyData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [name]: value,
      },
    }));
    clearRoleFieldError(role, name);
  };

  const applyRoleValidation = (role) => {
    const { valid, errors } = validateRole(familyData, role, lang);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (valid) {
        delete next[role];
      } else {
        next[role] = errors;
      }
      return next;
    });
    return valid;
  };

  const handleNext = () => {
    const currentRole = ROLES[step];
    if (!applyRoleValidation(currentRole)) {
      setValidationSummary(
        lang === "ar"
          ? "يرجى إكمال جميع بيانات هذا العضو بشكل صحيح قبل المتابعة."
          : "Please complete all fields for this member correctly before continuing.",
      );
      setShowValidationModal(true);
      return;
    }

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

  const buildSubmitPayload = () => {
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
    data.type = normalizeMembershipType(type);
    return data;
  };

  const handlePayment = () => {
    if (type === "Family" || type === "Newlywed") {
      applyRoleValidation(ROLES[step]);
    }

    const validation = validateApplicationForm(familyData, type, lang);
    if (!validation.valid) {
      setFieldErrors(validation.roleErrors);
      if (validation.firstInvalidRole) {
        const roleIndex = ROLES.indexOf(validation.firstInvalidRole);
        if (roleIndex >= 0) setStep(roleIndex);
      }
      setValidationSummary(buildValidationSummary(validation, lang));
      setShowValidationModal(true);
      return;
    }

    setFieldErrors({});
    setShowValidationModal(false);
    setValidationSummary("");
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const data = buildSubmitPayload();
    ApplicationApi(setLoading, setError, data, productId, setShowModal, payId);
  };

  const renderForm = (role, title) => {
    const person = familyData[role] || {};

    return (
      <div key={role} className={`application_form ${animation}`}>
        <h2>{title}</h2>
        <label>{langValue.appLabelName}</label>
        <input
          className={fieldErrorClass(role, "name")}
          type="text"
          placeholder={langValue.appPhName}
          name="name"
          value={person.name || ""}
          onChange={(e) => handleChange(e, role)}
        />
        {renderFieldError(role, "name")}
        <label>{langValue.appLabelPhone}</label>
        <div className="phone_container">
          <span className="phone_code">+966</span>
          <input
            className={fieldErrorClass(role, "phone")}
            type="text"
            placeholder="5XX XXX XXX"
            pattern="^5\d{8}$"
            title="Please enter a valid Saudi phone number (starting with 5)"
            name="phone"
            value={person.phone || ""}
            onChange={(e) => handleChange(e, role)}
          />
        </div>
        {renderFieldError(role, "phone")}
        <label>{langValue.appLabelEmail}</label>
        <input
          className={fieldErrorClass(role, "email")}
          type="email"
          placeholder={langValue.appPhEmail}
          name="email"
          value={person.email || ""}
          onChange={(e) => handleChange(e, role)}
        />
        {renderFieldError(role, "email")}
        <label>{langValue.appLabelGender}</label>
        <select
          name="gender"
          className={fieldErrorClass(role, "gender")}
          value={person.gender || ""}
          onChange={(e) => handleChange(e, role)}
        >
          <option value="">{langValue.appGenderPlaceholder}</option>
          <option value="Male">{langValue.appGenderMale}</option>
          <option value="Female">{langValue.appGenderFemale}</option>
        </select>
        {renderFieldError(role, "gender")}
        <div className="form1">
          <div className="form1_content">
            <label>{langValue.appLabelAddress}</label>
            <input
              className={fieldErrorClass(role, "address")}
              type="text"
              placeholder={langValue.appPhAddress}
              name="address"
              value={person.address || ""}
              onChange={(e) => handleChange(e, role)}
            />
            {renderFieldError(role, "address")}
          </div>
          <div className="form1_content">
            <label>{langValue.appLabelNationalId}</label>
            <input
              className={fieldErrorClass(role, "nationalID")}
              type="text"
              placeholder={langValue.appPhNationalId}
              name="nationalID"
              value={person.nationalID || ""}
              onChange={(e) => handleChange(e, role)}
            />
            {renderFieldError(role, "nationalID")}
          </div>
        </div>
        <div className="form1">
          <div className="form1_content">
            <label>{langValue.appLabelDob}</label>
            <input
              className={fieldErrorClass(role, "dateOfBirth")}
              type="date"
              name="dateOfBirth"
              value={person.dateOfBirth || ""}
              onChange={(e) => handleChange(e, role)}
            />
            {renderFieldError(role, "dateOfBirth")}
          </div>
        </div>
        <label>{langValue.appLabelNationality}</label>
        <input
          className={fieldErrorClass(role, "nationality")}
          type="text"
          placeholder={langValue.appPhNationality}
          name="nationality"
          value={person.nationality || ""}
          onChange={(e) => handleChange(e, role)}
        />
        {renderFieldError(role, "nationality")}
        {error && <p className="input_error api_error">{error}</p>}
      </div>
    );
  };

  const stepTitle =
    langValue[STEP_TITLE_KEYS[step]] ?? langValue.appFormStepFather;

  return (
    <div className="application">
      <div className="appliaction_container">
        <h1>{langValue.appPageTitle}</h1>
        <h2>{langValue.appPageSubtitle}</h2>

        {resolvingPayMeta && (
          <p>
            {lang === "ar"
              ? "جاري التحقق من بيانات الدفع..."
              : "Verifying payment details..."}
          </p>
        )}

        {!resolvingPayMeta && type && renderForm(ROLES[step], stepTitle)}

        {type === "Family" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            {step > 0 && (
              <button type="button" onClick={handleBack} className="back_button">
                {langValue.appBtnBack}
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="back_button">
                {langValue.appBtnNext}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePayment}
                className="back_button"
                disabled={loading}
              >
                {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
              </button>
            )}
          </div>
        )}
        {type === "Annual" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={handlePayment}
              className="back_button"
              disabled={loading}
            >
              {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
            </button>
          </div>
        )}
        {type === "Two-Year" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              onClick={handlePayment}
              className="back_button"
              disabled={loading}
            >
              {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
            </button>
          </div>
        )}
        {type === "Newlywed" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            {step > 0 && (
              <button type="button" onClick={handleBack} className="back_button">
                {langValue.appBtnBack}
              </button>
            )}
            {step < 1 ? (
              <button type="button" onClick={handleNext} className="back_button">
                {langValue.appBtnNext}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePayment}
                className="back_button"
                disabled={loading}
              >
                {loading ? langValue.appBtnLoading : langValue.appBtnActivate}
              </button>
            )}
          </div>
        )}
      </div>

      {showValidationModal && (
        <div className="modal">
          <div className="modal_content activation_error_modal">
            <div className="activation_error_icon">!</div>
            <h2>
              {lang === "ar" ? "بيانات غير مكتملة" : "Incomplete information"}
            </h2>
            <p className="validation_summary">{validationSummary}</p>
            <button
              type="button"
              className="validation_modal_btn"
              onClick={() => setShowValidationModal(false)}
            >
              {lang === "ar" ? "حسناً" : "OK"}
            </button>
          </div>
        </div>
      )}

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