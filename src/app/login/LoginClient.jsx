"use client";

import { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import LoginApi from "@/API/Login/LoginApi.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import Google from "@/API/Google/Google.api";
import "./login.css";
import { Lang } from "@/Lang/lang";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";

export default function LoginClient() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCode, setSelectedCode] = useState("+966"); // المفتاح الافتراضي
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
  }, []);

  const langValue = Lang[selectedLanguage];
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("code");

  const countries = [
    { name: "Saudi Arabia", iso2: "SA", dial_code: "+966" },
    { name: "United Arab Emirates", iso2: "AE", dial_code: "+971" },
    { name: "Egypt", iso2: "EG", dial_code: "+20" },
    { name: "Kuwait", iso2: "KW", dial_code: "+965" },
    { name: "Qatar", iso2: "QA", dial_code: "+974" },
    { name: "Bahrain", iso2: "BH", dial_code: "+973" },
    { name: "Oman", iso2: "OM", dial_code: "+968" },
    { name: "Jordan", iso2: "JO", dial_code: "+962" },
    { name: "Lebanon", iso2: "LB", dial_code: "+961" },
    { name: "Turkey", iso2: "TR", dial_code: "+90" },
    { name: "India", iso2: "IN", dial_code: "+91" },
    { name: "Pakistan", iso2: "PK", dial_code: "+92" },
    { name: "Bangladesh", iso2: "BD", dial_code: "+880" },
    { name: "Philippines", iso2: "PH", dial_code: "+63" },
    { name: "Indonesia", iso2: "ID", dial_code: "+62" },
    { name: "United States", iso2: "US", dial_code: "+1" },
    { name: "United Kingdom", iso2: "GB", dial_code: "+44" },
    { name: "Germany", iso2: "DE", dial_code: "+49" },
    { name: "France", iso2: "FR", dial_code: "+33" },
    { name: "China", iso2: "CN", dial_code: "+86" },
  ];

  const countryOptions = countries.map((c) => ({
    value: c.dial_code,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <ReactCountryFlag
          countryCode={c.iso2}
          svg
          style={{ width: "1.5em", height: "1.5em", marginRight: "8px" }}
        />
        {c.dial_code}
      </div>
    ),
  }));

  const handleLogin = () => {
    const fullPhone = `${selectedCode}${phone}`;
    const data = {
      identifier: fullPhone,
      code: query ? query : "",
    };

    if (phone === "") {
      setError("من فضلك أدخل رقم الهاتف");
      return;
    }

    if (phone.length < 5) {
      setError("من فضلك أدخل رقم هاتف صالح");
      return;
    }

    LoginApi(setLoading, setError, data, router);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const { access_token } = tokenResponse;
      const data = { access_token, code: query ? query : "" };
      Google(setError, data, router);
    },
  });

  return (
    <>
      <SEO
        title="تسجيل الدخول"
        description="تسجيل الدخول إلى حسابك في Glow Card."
        canonical="https://vercel.com/zeyad-mashaals-projects/glow-card/login"
      />

      <div className="login">
        <div className="login_container">
          <div className="login_content">
            <img src="/images/logo.png" alt="Glow Card" />
            <h1>{langValue["Login"]}</h1>
            <div className="form_group">
              <label htmlFor="phone">{langValue["phone"]}</label>
              <div className="login_key">
                {/* حقل إدخال الرقم */}
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="5XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    flex: 1,
                  }}
                />
                {/* Select خارج حقل الإدخال */}
                <Select
                  options={countryOptions}
                  defaultValue={countryOptions.find(
                    (opt) => opt.value === "+966"
                  )}
                  onChange={(selected) => setSelectedCode(selected.value)}
                  styles={{
                    control: (base) => ({
                      ...base,
                    }),
                  }}
                  className="country_key"
                />
              </div>
            </div>

            {error && <p className="error">{error}</p>}
            <button className="login_btn" onClick={handleLogin}>
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>

            <span className="separator">أو</span>

            <div className="login_google">
              <button onClick={() => loginWithGoogle()}>
                <span>{langValue["googleAuth"]}</span>
                <img
                  src="/images/google.png"
                  alt="Google Login"
                  loading="lazy"
                />
              </button>
            </div>
          </div>
          <div className="login_banner">
            <div className="login_card">
              <h1>{langValue["loginTitle"]}</h1>
              <img src="/images/Family.png" alt="Card" loading="lazy" />
            </div>
            <h2>{langValue["loginSubTitle"]}</h2>
            <p>{langValue["loginSubTitle2"]}</p>
          </div>
        </div>
      </div>
    </>
  );
}
