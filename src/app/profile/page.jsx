"use client";
import React, { useState, useEffect } from "react";
import "./profile.css";
import InvitationCode from "@/API/InvitationCode/InvitationCode";
import { Lang } from "@/Lang/lang";
import { Carousel } from "flowbite-react";

const Profile = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLanguage(lang);
    getInviteCode();
  }, []);
  const langValue = Lang[selectedLanguage];
  const [activeTab, setActiveTab] = useState("card_info");
  const [toastMessage, setToastMessage] = useState("");
  const [controller, setController] = useState(true);
  const [showContentOnMobile, setShowContentOnMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0); // للمؤثر البصري أثناء السحب
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = () => {
    const link = `https://glow-card.vercel.app/login?code=${code}`;
    navigator.clipboard.writeText(link).then(() => {
      setToastMessage("تم نسخ الرابط بنجاح!");
      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (windowWidth < 768) {
      setShowContentOnMobile(true);
    }
  };

  const getInviteCode = () => {
    InvitationCode(setLoading, setError, setCode);
  };

  const images = [
    "/images/cardfront.png",
    "/images/card.jpeg",
    "/images/cardfront.png",
  ];

  const [current, setCurrent] = useState(0);

  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <div className="profile">
      <div className="profile_container">
        {controller && (!showContentOnMobile || windowWidth >= 768) && (
          <div className="profile_controller">
            <div className="profile_img">
              <img src="/images/user.png" alt="" />
            </div>
            <h2>Zeyad Mashaal</h2>
            <div className="controller_tabs">
              <div
                className={`controller_tab ${
                  activeTab === "card_info" ? "active" : ""
                }`}
                onClick={() => handleTabClick("card_info")}
              >
                {langValue["cardInfo"]}
              </div>
              <div
                className={`controller_tab ${
                  activeTab === "invite_link" ? "active" : ""
                }`}
                onClick={() => handleTabClick("invite_link")}
              >
                {langValue["invitationLink"]}
              </div>
              <div
                className={`controller_tab ${
                  activeTab === "logout" ? "active" : ""
                }`}
                onClick={() => handleTabClick("logout")}
              >
                {langValue["logout"]}
              </div>
            </div>
          </div>
        )}

        {(!controller || showContentOnMobile || windowWidth >= 768) && (
          <div className="profile_content">
            {/* Back button for mobile */}
            {windowWidth < 768 && showContentOnMobile && (
              <button
                className="back_button"
                onClick={() => setShowContentOnMobile(false)}
              >
                <span>&lt;--</span> Back to Profile
              </button>
            )}

            {activeTab === "card_info" && (
              <div className="profile_content_card card_info">
                <h2>{langValue["cardInfo"]}</h2>
                <div
                  className="w-full flex justify-center items-center h-56 sm:h-64 xl:h-80 2xl:h-96 relative overflow-hidden rounded-xl"
                  onMouseDown={(e) => {
                    setDragStartX(e.clientX);
                    setIsDragging(true);
                  }}
                  onMouseMove={(e) => {
                    if (isDragging) {
                      setDragOffset(e.clientX - dragStartX); // تحديث المؤثر البصري أثناء السحب
                    }
                  }}
                  onMouseUp={(e) => {
                    const diff = e.clientX - dragStartX;
                    if (diff > 50) goToPrev(); // إذا تم السحب لليمين
                    else if (diff < -50) goToNext(); // إذا تم السحب لليسار

                    // إيقاف السحب
                    setIsDragging(false);
                    setDragOffset(0); // إعادة تعيين المؤثر البصري بعد السحب
                  }}
                  onMouseLeave={() => {
                    // إيقاف السحب إذا ترك المستخدم العنصر
                    setIsDragging(false);
                    setDragOffset(0);
                  }}
                >
                  <img
                    src={images[current]}
                    alt={`Slide ${current}`}
                    className={`max-w-full max-h-full object-contain transition-all duration-700 select-none ${
                      isDragging ? "cursor-grabbing" : "cursor-pointer"
                    }`}
                    style={{
                      transform: `translateX(${dragOffset}px)`, // إضافة تأثير السحب باستخدام translateX
                    }}
                    draggable={false}
                  />

                  {/* الدوائر */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full cursor-pointer ${
                          current === index ? "bg-black" : "bg-gray-400"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="card_info">
                  <div className="card_info_item">
                    <h3>Personal Card</h3>
                    <p>Zeyad Mashaal</p>
                    <div className="card_info_item_date">
                      <span>12 / 4 / 2024</span>
                      <p>subscription date was</p>
                    </div>
                    <div className="card_info_item_date">
                      <span>12 / 4 / 2024</span>
                      <p>Expire date at</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "invite_link" && (
              <div className="profile_content_card invite_link">
                <h2> {langValue["invitationLink"]}</h2>
                <p>{langValue["invitationLinkP"]}</p>
                <div className="invitation_link">
                  <p>https://glow-card.vercel.app/login?code={code}</p>
                  <button onClick={handleCopy}>Copy</button>
                </div>
                {toastMessage && (
                  <div className="toast">
                    <p>{toastMessage}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "logout" && (
              <div className="profile_content_card logout">
                <h2> {langValue["logout"]}</h2>
                <p>
                  <span>انتبه!!</span> في حال خروجك من هذا الحساب لن تستطيع
                  مشاهدة البطاقة إلا عند التسجيل مرة اخرى!!!
                </p>
                <button className="logout_button">Log Out</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
