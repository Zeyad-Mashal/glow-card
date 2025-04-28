"use client";
import React, { useState } from "react";
import "./application.css";
import { useRouter, useSearchParams } from "next/navigation";
import ApplicationApi from "@/API/Application/ApplicationApi.api";
import Validator from "./Validator";
import Link from "next/link";

const ApplicationClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // حالة لعرض الموديل

  const type = localStorage.getItem("type");
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  if (!type) {
    router.push("/");
  }

  const [step, setStep] = useState(0);
  const [animation, setAnimation] = useState("fade-in");

  const [familyData, setFamilyData] = useState({
    father: {},
    mother: {},
    child1: {},
    child2: {},
  });

  const handleChange = (e, role) => {
    const { name, value } = e.target;
    setFamilyData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [name]: value,
      },
    }));
  };

  const handleNext = () => {
    const currentRole = roles[step];
    console.log(
      `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Data:`,
      familyData[currentRole]
    );

    document.querySelectorAll(".input_field").forEach((input) => {
      input.value = ""; // Clear the input fields
    });
    setAnimation("fade-out");
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setAnimation("fade-in");
    }, 500); // timing matches CSS duration
  };

  const handleBack = () => {
    setAnimation("fade-out");
    setTimeout(() => {
      setStep((prev) => prev - 1);
      setAnimation("fade-in");
    }, 500);
  };

  const handlePayment = () => {
    const isValidator = Validator(familyData);
    if (!isValidator) {
      alert("كل الحقول مطلوبة!!");
      return;
    }

    let data = {};
    if (type === "Annual" || type === "Two-Year") {
      data = familyData.father;
      data.spouse = {};
      data.members = [];
    } else if (type === "Newlywed") {
      data = familyData.father;
      data.spouse = familyData.mother;
      data.spouse.relationship = "wife";
    } else {
      data = familyData.father;
      data.members = [];
      data.members[0] = familyData.mother;
      data.members[0].relationship = "wife";
      data.members[1] = familyData.child1;
      data.members[1].relationship = "son";
      data.members[2] = familyData.child2;
      data.members[2].relationship = "son";
    }
    data.type = type;
    ApplicationApi(setLoading, setError, data, router, id, setShowModal);
  };

  const roles = ["father", "mother", "child1", "child2"];
  const titles = [
    "Main Client",
    "Wife Application",
    "Child 1 Application",
    "Child 2 Application",
  ];

  const renderForm = (role, title) => (
    <div className={`application_form ${animation}`}>
      <h2>{title}</h2>
      <label>Your Name:</label>
      <input
        className="input_field"
        type="text"
        placeholder="Your Name"
        name="name"
        onChange={(e) => handleChange(e, role)}
      />
      <label>Phone:</label>
      <input
        className="input_field"
        type="text"
        placeholder="Phone"
        name="phone"
        onChange={(e) => handleChange(e, role)}
      />
      <label>Gender:</label>
      <select name="gender" onChange={(e) => handleChange(e, role)}>
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <div className="form1">
        <div className="form1_content">
          <label>Address:</label>
          <input
            className="input_field"
            type="text"
            placeholder="Address"
            name="address"
            onChange={(e) => handleChange(e, role)}
          />
        </div>
        <div className="form1_content">
          <label>National ID:</label>
          <input
            className="input_field"
            type="text"
            placeholder="National ID"
            name="nationalID"
            onChange={(e) => handleChange(e, role)}
          />
        </div>
      </div>
      <div className="form1">
        <div className="form1_content">
          <label>Date of Birth:</label>
          <input
            className="input_field"
            type="date"
            name="dateOfBirth"
            onChange={(e) => handleChange(e, role)}
          />
        </div>
        <div className="form1_content">
          <label>Age:</label>
          <input
            className="input_field"
            type="text"
            placeholder="Age"
            name="age"
            onChange={(e) => handleChange(e, role)}
          />
        </div>
      </div>
      <label>Nationality:</label>
      <input
        className="input_field"
        type="text"
        placeholder="Nationality"
        name="nationality"
        onChange={(e) => handleChange(e, role)}
      />
      {error}
    </div>
  );

  return (
    <div className="application">
      <div className="appliaction_container">
        <h1>Request Card</h1>
        <h2>
          One card, easy to use – choose the card that suits your needs now!
        </h2>

        {type && renderForm(roles[step], titles[step])}

        {type === "Family" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            {step > 0 && (
              <button onClick={handleBack} className="back_button">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext} className="back_button">
                Next
              </button>
            ) : (
              <button onClick={handlePayment} className="back_button">
                {loading ? "Loading..." : "Payment"}
              </button>
            )}
          </div>
        )}
        {type === "Annual" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={handlePayment} className="back_button">
              {loading ? "Loading..." : "Payment"}
            </button>
          </div>
        )}
        {type === "Two-Year" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={handlePayment} className="back_button">
              {loading ? "Loading..." : "Payment"}
            </button>
          </div>
        )}
        {type === "Newlywed" && (
          <div style={{ display: "flex", gap: "1rem" }}>
            {step > 0 && (
              <button onClick={handleBack} className="back_button">
                Back
              </button>
            )}
            {step < 1 ? (
              <button onClick={handleNext} className="back_button">
                Next
              </button>
            ) : (
              <button onClick={handlePayment} className="back_button">
                {loading ? "Loading..." : "Payment"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* الموديل الخاص بالشكر */}
      {showModal && (
        <div className="modal">
          <div className="modal_content">
            <h2>شكراً لاشتراكك معنا!</h2>
            <p>يرجى التوجه إلى تفاصيل البطاقة لمتابعة العملية.</p>
            <Link href={"/profile"}>من هنا</Link>
            <button onClick={() => setShowModal(false)}>إغلاق</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationClient;
