"use client";
import React, { useState, useEffect } from "react";

const FamilyMembershipSlider = ({
  members,
  selectedLanguage,
  formatCode,
  formatDate,
}) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    if (!members.length) {
      setSliderIndex(0);
      return;
    }
    if (sliderIndex > members.length - 1) {
      setSliderIndex(0);
    }
  }, [members.length, sliderIndex]);

  if (!members.length) return null;

  const current = members[sliderIndex];

  return (
    <>
      <div className="family_slider">
        {members.length > 1 && (
          <button
            type="button"
            className="family_slider_btn"
            onClick={() =>
              setSliderIndex(
                (prev) => (prev - 1 + members.length) % members.length,
              )
            }
            aria-label={selectedLanguage === "ar" ? "السابق" : "Previous"}
          >
            ‹
          </button>
        )}

        <div className="card_info">
          <div className="card_info_item">
            <div className="card_info_image" draggable={false}>
              <img
                src={current?.card?.images?.[0]}
                alt="Family Membership Card"
              />
              <div className="card_info_content">
                <h2 style={{ direction: "ltr" }}>{formatCode(current.code)}</h2>
                <h3>{current.name || "-"}</h3>
                <h3>
                  {selectedLanguage === "ar" ? "الخصم" : "Discount"}:{" "}
                  {current.discount || "-"}
                </h3>
                <div className="card_info_content_date">
                  <p>
                    {selectedLanguage === "ar"
                      ? "تاريخ الانتهاء"
                      : "Ex Date"}
                    : {formatDate(current.expiryDate)}
                  </p>
                  <p>
                    {selectedLanguage === "ar"
                      ? "تاريخ البداية"
                      : "Start Date"}
                    : {formatDate(current.activationDate)}
                  </p>
                </div>
              </div>
            </div>

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
                  <span>{current.type || "-"}</span>
                </div>
                <div className="membership_detail_item">
                  <p className="membership_detail_label">
                    {selectedLanguage === "ar"
                      ? "نوع البطاقة"
                      : "Card Holder Type"}
                  </p>
                  <span>{current.personLabel || "-"}</span>
                </div>
                <div className="membership_detail_item">
                  <p className="membership_detail_label">
                    {selectedLanguage === "ar"
                      ? "اسم العضو الكامل"
                      : "Full Name"}
                  </p>
                  <span>{current.name || "-"}</span>
                </div>
                <div className="membership_detail_item">
                  <p className="membership_detail_label">
                    {selectedLanguage === "ar" ? "رقم الهوية" : "National ID"}
                  </p>
                  <span>{current.nationalID || "-"}</span>
                </div>
                <div className="membership_detail_item">
                  <p className="membership_detail_label">
                    {selectedLanguage === "ar" ? "رقم الجوال" : "Phone"}
                  </p>
                  <span>{current.phone || "-"}</span>
                </div>
                <div className="membership_detail_item">
                  <p className="membership_detail_label">
                    {selectedLanguage === "ar"
                      ? "رقم العضوية"
                      : "Membership Number"}
                  </p>
                  <span className="codeNumber">{formatCode(current.code)}</span>
                </div>
                <div className="membership_detail_item">
                  <p className="membership_detail_label">
                    {selectedLanguage === "ar"
                      ? "تاريخ الاشتراك"
                      : "Subscription Date"}
                  </p>
                  <span>{formatDate(current.activationDate)}</span>
                </div>
                <div className="membership_detail_item">
                  <p className="membership_detail_label">
                    {selectedLanguage === "ar"
                      ? "تاريخ الانتهاء"
                      : "Expiry Date"}
                  </p>
                  <span>{formatDate(current.expiryDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {members.length > 1 && (
          <button
            type="button"
            className="family_slider_btn"
            onClick={() =>
              setSliderIndex((prev) => (prev + 1) % members.length)
            }
            aria-label={selectedLanguage === "ar" ? "التالي" : "Next"}
          >
            ›
          </button>
        )}
      </div>

      {members.length > 1 && (
        <div className="family_slider_dots">
          {members.map((item, index) => (
            <button
              key={item.sliderKey || index}
              type="button"
              className={`family_dot ${sliderIndex === index ? "active" : ""}`}
              onClick={() => setSliderIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FamilyMembershipSlider;
