"use client";

import { useState } from "react";
import SEO from "../../components/SEO";
import LoginApi from "@/API/Login/LoginApi.api";
import { useRouter, useSearchParams } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import Google from "@/API/Google/Google.api";
import "./login.css";

export default function LoginClient() {
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
            <h1>تسجيل الدخول</h1>
            <div className="form_group">
              <label htmlFor="phone">رقم الهاتف</label>
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
                <span>سجل دخول بواسطة جوجل</span>
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
              <h1>استمتع براحة استخدام بطاقة الخصم الخاصة بك</h1>
              <img src="/images/cardfront.png" alt="Card" loading="lazy" />
            </div>
            <h2>إطلاق ميزات جديدة</h2>
            <p>
              احصل على أسعار مخفضة في أفضل المراكز الطبية دون دفع السعر الكامل.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
