"use client";

import { useState, useRef } from "react";
import "./otp.css";
import OTP from "@/API/OTP/OTP.api";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
      setError("من فضلك ادخل الكود كاملاً.");
      return;
    }
    if (!query) {
      setError("رقم الهاتف غير موجود.");
      return;
    }
    const data = {
      phone: query,
      code: fullOtp,
    };
    OTP(setLoading, setError, data, router);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm w-full bg-white p-6 rounded-2xl shadow-md opt_container">
        <h1 className="text-2xl font-bold mb-4 text-center">ادخل الكود</h1>
        <p className="mb-6 text-center text-gray-600">
          تم ارسال كود مكون من 6 ارقام الى رقم هاتفك, الرقم من اليسار الى
          اليمين.
        </p>

        <div className="flex justify-between gap-2 mb-6 code_otp">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              className="w-10 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        {error && (
          <p className="text-red-600 text-sm text-center mb-2">{error}</p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-5 rounded-md hover:bg-blue-700 transition-all"
        >
          {loading ? "جاري التحقق..." : "تحقق من الكود"}
        </button>
      </div>
    </div>
  );
}
