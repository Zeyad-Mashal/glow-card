"use client";
import React, { useState, useEffect } from "react";
import "./profile.css";
import InvitationCode from "@/API/InvitationCode/InvitationCode";
import { Lang } from "@/Lang/lang";
import GetCardInfo from "@/API/CardInfo/GetCardInfo";
import ActivateCards from "@/API/ActivateCards/ActivateCards";
import { useRouter } from "next/navigation";
import normalizeMembershipType from "@/utils/normalizeMembershipType";
import FamilyMembershipSlider from "./FamilyMembershipSlider";

const Profile = () => {
  const router = useRouter();
  const familyTypes = new Set(["family", "newlywed"]);

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

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString(
      selectedLanguage === "ar" ? "ar-SA-u-nu-latn" : "en-GB",
    );
  };

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

  const getCardInfo = () => {
    GetCardInfo(setLoading, setError, setCardInfo);
  };

  const normalizedPhone = (value) => (value || "").toString().trim();
  const normalizeType = (value) =>
    (value || "").toString().trim().toLowerCase();
  const formatCode = (value) => {
    if (!value) return "-";
    const codeValue = value.toString();
    return codeValue.match(/.{1,2}/g)?.join(" ") || codeValue;
  };

  const buildPersonCard = (card, person, label, suffix) => ({
    ...card,
    name: person?.name || "-",
    nationalID: person?.nationalID || "-",
    phone: person?.phone || "-",
    gender: person?.gender || "-",
    dateOfBirth: person?.dateOfBirth || "-",
    nationality: person?.nationality || "-",
    relationship: person?.relationship || "",
    code: person?.code || card.code,
    personLabel: label,
    sliderKey: `${card._id || card.code || "family"}-${suffix}`,
  });

  const buildFamilyCards = (card, currentPhone) => {
    const ownerPhone = normalizedPhone(card.phone);
    const spousePhone = normalizedPhone(card.spouse?.phone);
    const memberByPhone =
      card.members?.find(
        (member) => normalizedPhone(member?.phone) === currentPhone,
      ) || null;

    if (ownerPhone && ownerPhone === currentPhone) {
      const cards = [
        buildPersonCard(
          card,
          card,
          selectedLanguage === "ar" ? "العضو الأساسي" : "Primary Member",
          "owner",
        ),
      ];

      if (card.spouse) {
        cards.push(
          buildPersonCard(
            card,
            card.spouse,
            selectedLanguage === "ar" ? "الزوج/الزوجة" : "Spouse",
            "spouse",
          ),
        );
      }

      (card.members || []).forEach((member, index) => {
        cards.push(
          buildPersonCard(
            card,
            member,
            selectedLanguage === "ar"
              ? `فرد العائلة ${index + 1}`
              : `Family Member ${index + 1}`,
            `member-${member?._id || index}`,
          ),
        );
      });

      return cards;
    }

    if (spousePhone && spousePhone === currentPhone) {
      return [
        buildPersonCard(
          card,
          card.spouse,
          selectedLanguage === "ar"
            ? "بياناتك (زوج/زوجة)"
            : "Your Card (Spouse)",
          "spouse-only",
        ),
      ];
    }

    if (memberByPhone) {
      return [
        buildPersonCard(
          card,
          memberByPhone,
          selectedLanguage === "ar"
            ? "بياناتك (فرد عائلة)"
            : "Your Card (Family Member)",
          `member-only-${memberByPhone?._id || "member"}`,
        ),
      ];
    }

    return [];
  };

  const currentUserPhone = normalizedPhone(phone);
  const regularMembershipCards = cardInfo.filter(
    (card) => !familyTypes.has(normalizeType(card.type)),
  );
  const familyMembershipGroups = cardInfo
    .filter((card) => familyTypes.has(normalizeType(card.type)))
    .map((card, index) => ({
      id: card._id || card.code || `membership-${index}`,
      type: normalizeType(card.type),
      ownerCode: card.code,
      members: buildFamilyCards(card, currentUserPhone),
    }))
    .filter((group) => group.members.length > 0);

  const getMembershipGroupTitle = (group, index) => {
    const isFamily = group.type === "family";
    const label =
      selectedLanguage === "ar"
        ? isFamily
          ? "عضوية عائلة"
          : "عضوية أزواج"
        : isFamily
          ? "Family Membership"
          : "Couples Membership";
    const codeHint = group.ownerCode ? ` (${formatCode(group.ownerCode)})` : "";

    if (familyMembershipGroups.length > 1) {
      return `${label} ${index + 1}${codeHint}`;
    }

    return `${label}${codeHint}`;
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
    localStorage.setItem("type", normalizeMembershipType(type));
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
                <span>&lt;--</span>{" "}
                {selectedLanguage === "ar" ? "رجوع" : "Back"}
              </button>
            )}

            {activeTab === "card_info" && (
              <div className="profile_content_card card_info">
                <h2>{langValue["cardInfo"]}</h2>

                <div className="card_details_list">
                  {regularMembershipCards.map((card, index) => (
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
                            src={card.card?.images?.[0]}
                            alt={`Card ${index + 1}`}
                          />
                          <div className="card_info_content">
                            <h2 style={{ direction: "ltr" }}>
                              {formatCode(card.code)}
                            </h2>
                            <h3>{card.name}</h3>
                            <h3>Discount: {card.discount}</h3>
                            <div className="card_info_content_date">
                              <p>Ex Date: {card.expiryDate}</p>
                              <p>start Date: {card.activationDate}</p>
                            </div>
                          </div>
                        </div>
                        {/* <h3>{card.type}</h3>
                        <p>{card.name}</p> */}

                        <div className="membership_details_card">
                          <h4 className="membership_details_title">
                            {selectedLanguage === "ar"
                              ? "تفاصيل العضوية"
                              : "Membership Details"}
                          </h4>
                          <div className="membership_details_grid">
                            <div className="membership_detail_item">
                              <p className="membership_detail_label">
                                {selectedLanguage === "ar"
                                  ? "نوع العضوية"
                                  : "Membership Type"}
                              </p>
                              <span>{card.type || "-"}</span>
                            </div>
                            <div className="membership_detail_item">
                              <p className="membership_detail_label">
                                {selectedLanguage === "ar"
                                  ? "اسم العضو الكامل"
                                  : "Full Name"}
                              </p>
                              <span>{card.name || "-"}</span>
                            </div>
                            <div className="membership_detail_item">
                              <p className="membership_detail_label">
                                {selectedLanguage === "ar"
                                  ? "رقم الهوية"
                                  : "National ID"}
                              </p>
                              <span>{card.nationalID || "-"}</span>
                            </div>
                            <div className="membership_detail_item">
                              <p className="membership_detail_label">
                                {selectedLanguage === "ar"
                                  ? "رقم العضوية"
                                  : "Membership Number"}
                              </p>
                              <span className="codeNumber">
                                {formatCode(card.code)}
                              </span>
                            </div>
                            <div className="membership_detail_item">
                              <p className="membership_detail_label">
                                {selectedLanguage === "ar"
                                  ? "تاريخ الاشتراك"
                                  : "Subscription Date"}
                              </p>
                              <span>{formatDate(card.activationDate)}</span>
                            </div>
                            <div className="membership_detail_item">
                              <p className="membership_detail_label">
                                {selectedLanguage === "ar"
                                  ? "تاريخ الانتهاء"
                                  : "Expiry Date"}
                              </p>
                              <span>{formatDate(card.expiryDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {familyMembershipGroups.length > 0 && (
                  <div className="family_slider_wrapper">
                    <h3 className="family_slider_title">
                      {selectedLanguage === "ar"
                        ? "بطاقات عضوية الأزواج والعائلة"
                        : "Family & Newlywed Membership Cards"}
                    </h3>

                    <div className="family_slider_groups">
                      {familyMembershipGroups.map((group, index) => (
                        <div key={group.id} className="family_membership_group">
                          {familyMembershipGroups.length > 1 && (
                            <h4 className="family_membership_group_title">
                              {getMembershipGroupTitle(group, index)}
                            </h4>
                          )}
                          <FamilyMembershipSlider
                            members={group.members}
                            selectedLanguage={selectedLanguage}
                            formatCode={formatCode}
                            formatDate={formatDate}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                                item.product.type,
                              )
                            }
                          >
                            {selectedLanguage === "ar" ? (
                              <h3>{item.product.name.ar}</h3>
                            ) : (
                              <h3>{item.product.name.en}</h3>
                            )}
                            <p>{item.product.type}</p>
                          </div>
                          <div className="card_price">
                            {item.totalPrice}{" "}
                            {selectedLanguage === "ar" ? "ريال" : " SAR"}
                            {/* <span onClick={() => handleGiftCopy(item._id)}>
                              نسخ رابط الهديه
                            </span> */}
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
                  {selectedLanguage === "ar"
                    ? `انتبه!!في حال خروجك من هذا الحساب لن تستطيع مشاهدة عضويتك إلا عند التسجيل مرة اخرى!!!`
                    : "Attention!! If you log out of this account, you will not be able to view your membership unless you log in again!!!"}
                </p>
                <button className="logout_button" onClick={logout}>
                  {langValue["logout"]}
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
