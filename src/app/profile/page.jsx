"use client";
import React, { useState, useEffect } from "react";
import "./profile.css";
import InvitationCode from "@/API/InvitationCode/InvitationCode";
import { Lang } from "@/Lang/lang";
import GetCardInfo from "@/API/CardInfo/GetCardInfo";
import ActivateCards from "@/API/ActivateCards/ActivateCards";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] = useState("ar");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "ar";
    setSelectedLanguage(lang);
    getInviteCode();
    getCardInfo();
    getAllCardsActivations();
    const phone = localStorage.getItem("phone");
    setPhone(phone);
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
  const [cardInfo, setCardInfo] = useState([]);
  const [allCardsActivations, setAllCardsActivations] = useState([]);
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

  const handleGiftCopy = (giftId) => {
    const link = `https://www.glowcard.com.sa/gift?gift=${giftId}`;
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

  const getCardInfo = () => {
    GetCardInfo(setLoading, setError, setCardInfo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    localStorage.removeItem("type");
    setTimeout(() => {
      window.location.replace("/");
    }, 500);
  };

  const getAllCardsActivations = () => {
    ActivateCards(setLoading, setError, setAllCardsActivations);
  };

  const goToActivate = (productId, payId, type) => {
    localStorage.setItem("type", type);
    router.push(`/application/${productId}?payId=${payId}`);
  };

  return (
    <div className="profile">
      <div className="profile_container">
        {controller && (!showContentOnMobile || windowWidth >= 768) && (
          <div className="profile_controller">
            <div className="profile_img">
              <img src="/images/user.png" alt="" />
            </div>
            <h2>{phone ? phone : "Welcome"}</h2>
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
                  activeTab === "activation" ? "active" : ""
                }`}
                onClick={() => handleTabClick("activation")}
              >
                {langValue["activation"]}
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

                <div className="card_details_list">
                  {cardInfo.map((card, index) => (
                    <div key={index} className="card_info">
                      <div className="card_info_item">
                        <div
                          className={`card_info_image ${
                            isDragging ? "cursor-grabbing" : "cursor-pointer"
                          }`}
                          style={{
                            transform: `translateX(${dragOffset}px)`, // إضافة تأثير السحب باستخدام translateX
                          }}
                          draggable={false}
                        >
                          <img
                            src="/images/frontempety.png"
                            alt={`Slide ${current}`}
                          />
                          <div className="card_info_content">
                            <h2 style={{ direction: "ltr" }}>
                              {card.code.match(/.{1,2}/g).join(" ")}
                            </h2>
                            <h3>Name: {card.name}</h3>
                            <h3>Discount: {card.discount}</h3>
                            <div className="card_info_content_date">
                              <p>Ex Date: {card.expiryDate}</p>
                              <p>start Date: {card.activationDate}</p>
                            </div>
                          </div>
                        </div>
                        <h3>{card.type}</h3>
                        <p>{card.name}</p>

                        <div className="card_info_item_date">
                          <span className="codeNumber">
                            {card.code?.match(/.{1,2}/g).join(" ")}
                          </span>
                          <p>Code Number</p>
                        </div>
                        <div className="card_info_item_date">
                          <span>{card.activationDate}</span>
                          <p>subscription date</p>
                        </div>
                        <div className="card_info_item_date">
                          <span>{card.expiryDate}</span>
                          <p>Expire date</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activation" && (
              <div className="activation">
                <div className="activation_container">
                  <div className="activation_list">
                    {allCardsActivations.map((item, index) => {
                      return (
                        <div className="activation_item" key={index}>
                          <div
                            className="card_name"
                            onClick={() =>
                              goToActivate(
                                item.product._id,
                                item._id,
                                item.product.type
                              )
                            }
                          >
                            <h3>{item.product.name.ar}</h3>
                            <p>{item.product.type}</p>
                          </div>
                          <div className="card_price">
                            {item.totalPrice} ر.س
                            <span onClick={() => handleGiftCopy(item._id)}>
                              نسخ رابط الهديه
                            </span>
                            {toastMessage && (
                              <div className="toast">
                                <p>{toastMessage}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
                <button className="logout_button" onClick={logout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
