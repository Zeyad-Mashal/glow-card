"use client";
import React, { useState, useEffect } from "react";
import "./details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faHouse,
  faPhone,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";
import FoundationDetails from "@/API/FoundationDetails/FoundationDetails";

const FoundationClient = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const nextImage = () => {
    if (foundationDetails?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === foundationDetails.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (foundationDetails?.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? foundationDetails.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (foundationDetails?.images?.length) {
      setCurrentImageIndex(0);
    }
  }, [foundationDetails?.images]);

  return (
    <div className="foundation_details">
      <div className="foundation_details_container">
        <h1>{foundationDetails.name}</h1>
        {foundationDetails?.images && foundationDetails.images.length > 0 && (
          <div className="foundation_images_slider">
            <div className="slider_main_image">
              {foundationDetails.images.length > 1 && (
                <button
                  className="slider_nav_btn slider_prev_btn"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
              )}
              <img
                src={foundationDetails.images[currentImageIndex]}
                alt={`foundation image ${currentImageIndex + 1}`}
                loading="lazy"
              />
              {foundationDetails.images.length > 1 && (
                <button
                  className="slider_nav_btn slider_next_btn"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              )}
            </div>
            {foundationDetails.images.length > 1 && (
              <div className="slider_thumbnails">
                {foundationDetails.images.map((img, index) => (
                  <button
                    key={index}
                    className={`slider_thumbnail ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => goToImage(index)}
                  >
                    <img
                      src={img}
                      alt={`thumbnail ${index + 1}`}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
            {foundationDetails.images.length > 1 && (
              <div className="slider_indicator">
                {currentImageIndex + 1} / {foundationDetails.images.length}
              </div>
            )}
          </div>
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
