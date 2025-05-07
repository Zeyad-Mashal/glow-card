"use client";
import React, { useState, useEffect } from "react";
import "./details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faHouse,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import FoundationDetails from "@/API/FoundationDetails/FoundationDetails";

const FoundationClient = () => {
  useEffect(() => {
    foundationDetailsApi();
  }, []);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [foundationDetails, setFoundationDetails] = useState([]);

  const foundationDetailsApi = () => {
    FoundationDetails(setLoading, setError, setFoundationDetails, id);
  };
  return (
    <div className="foundation_details">
      <div className="foundation_details_container">
        <h1>{foundationDetails.name}</h1>
        {foundationDetails?.images && foundationDetails.images.length > 0 && (
          <img
            src={foundationDetails.images[0]}
            alt="foundation image"
            loading="lazy"
          />
        )}

        <div className="foundation_details_header">
          <div className="foundation_details_header_info">
            <FontAwesomeIcon icon={faHouse} />
            {foundationDetails?.address?.map((branch, index) => (
              <a key={index} href={branch.map} target="_blanck">
                الفرع {index + 1} : {branch.ar}
              </a>
            ))}
          </div>
          <div className="foundation_details_header_info">
            <FontAwesomeIcon icon={faPhone} />
            <p>هاتف : {foundationDetails.phone}</p>
          </div>
          <div className="foundation_details_header_info">
            <img src="/images/googleMap.png" alt="google map" loading="lazy" />
            {foundationDetails.address &&
              foundationDetails.address.length > 0 && (
                <a
                  href={foundationDetails.address[0].map}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  الموقع علي جوجل ماب
                </a>
              )}
          </div>
        </div>

        <div className="foundation_details_content">
          <h2>الخصومات و العروض</h2>
          <div className="table-responsive">
            <table className="discounts-table">
              <thead>
                <tr>
                  <th>اسم الخدمة</th>
                  <th>الخصم</th>
                </tr>
              </thead>
              <tbody>
                {foundationDetails?.offers?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.ar}</td>
                    <td>{item.offer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationClient;
