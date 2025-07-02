"use client";
import React, { useEffect, useState } from "react";
import "./New.css";
import Link from "next/link";
import LatestFoundation from "@/API/LatestFoundation/LatestFoundation";
const page = () => {
  useEffect(() => {
    getLatestFoundations();
  }, []);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [allLatestFoundation, setAllLatestFoundation] = useState([]);
  const getLatestFoundations = () => {
    LatestFoundation(setloading, setError, setAllLatestFoundation);
  };
  return (
    <div className="new">
      <div className="new_container">
        <h1>انضم حديثا</h1>
        <div className="new_list">
          {loading
            ? "Loading..."
            : allLatestFoundation.map((item, index) => {
                return (
                  <Link href={`/foundation-details?id=${item._id}`}>
                    <div className="new_item" key={index}>
                      <img src={item.images[0]} alt="new comes" />
                      <h2>{item.name}</h2>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default page;
