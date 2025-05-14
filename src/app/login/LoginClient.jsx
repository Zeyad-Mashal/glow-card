"use client";

import { useState, useEffect } from "react";
import SEO from "../../components/SEO";
import LoginApi from "@/API/Login/LoginApi.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import Google from "@/API/Google/Google.api";
import "./login.css";
import { Lang } from "@/Lang/lang";
export default function LoginClient() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
  }, []);

  const langValue = Lang[selectedLanguage];
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("code");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const data = {
      identifier: phone,
      code: query ? query : "",
    };

    if (phone == "") {
      setError("من فضلك أدخل رقم الهاتف");
      return;
    }

    if (phone.length !== 9) {
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
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="5XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <span>+966</span>
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
              <img src="/images/cardfront.png" alt="Card" loading="lazy" />
            </div>
            <h2>{langValue["loginSubTitle"]}</h2>
            <p>{langValue["loginSubTitle2"]}</p>
          </div>
        </div>
      </div>
    </>
  );
}
