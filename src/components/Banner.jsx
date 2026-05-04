import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./banner.css";
import HomeBanner from "@/API/HomeBanner/HomeBanner.api";

/** City is stored in localStorage as `user_city` (see CityPopup / Navbar). */
const getCityIdFromStorage = () => {
  try {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("user_city")
        : null;
    if (!raw || !String(raw).trim()) return "";
    const trimmed = String(raw).trim();
    // أحيانًا يُحفظ كسلسلة JSON: {"id":"...","name":"..."}
    if (trimmed.startsWith("{")) {
      const parsed = JSON.parse(trimmed);
      return String(parsed?._id ?? parsed?.id ?? "");
    }
    // أو كمعرّف مباشر
    return trimmed;
  } catch {
    return "";
  }
};

const Banner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banners, setBanners] = useState([]);
  const [isLang, setIsLang] = useState("ar");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const currentLang =
      typeof window !== "undefined"
        ? localStorage.getItem("lang") || "ar"
        : "ar";
    setIsLang(currentLang);
    const cityId = getCityIdFromStorage();
    HomeBanner(setLoading, setError, setBanners, currentLang, cityId);
  }, []);

  return (
    <div className="banner">
      {isLang === "ar"
        ? banners.slice(0, 4).map((item, index) => {
            return (
              <a href={item.url} key={index} target="_blank">
                <img
                  src={item.banner}
                  alt={`Home Banner ${index + 1}`}
                  data-aos="fade-up"
                  loading="lazy"
                />
              </a>
            );
          })
        : banners.slice(4).map((item, index) => {
            return (
              <a href={item.url} key={index} target="_blank">
                <img
                  src={item.banner}
                  alt={`Home Banner ${index + 5}`}
                  data-aos="fade-up"
                  loading="lazy"
                />
              </a>
            );
          })}
    </div>
  );
};

export default Banner;
