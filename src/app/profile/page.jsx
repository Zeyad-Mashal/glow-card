"use client";
import React, { useState, useEffect } from "react";
import "./profile.css";
import InvitationCode from "@/API/InvitationCode/InvitationCode";
const Profile = () => {
  useEffect(() => {
    getInviteCode();
  }, []);
  const [activeTab, setActiveTab] = useState("card_info");
  const [toastMessage, setToastMessage] = useState("");
  const [controller, setController] = useState(true);
  const [showContentOnMobile, setShowContentOnMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

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
                Card Info
              </div>
              <div
                className={`controller_tab ${
                  activeTab === "invite_link" ? "active" : ""
                }`}
                onClick={() => handleTabClick("invite_link")}
              >
                Invitation link
              </div>
              <div
                className={`controller_tab ${
                  activeTab === "logout" ? "active" : ""
                }`}
                onClick={() => handleTabClick("logout")}
              >
                Log Out
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
                <h2>Card Info</h2>
                <div className="card_info">
                  <img src="/images/cardfront.png" alt="" />
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
                <h2>Invitation Link</h2>
                <p>
                  شارك هذا الرابط مع صديقك للحصول على شهرين مجانيين في حال
                  اشتراكه معنا
                </p>
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
                <h2>Log Out</h2>
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
