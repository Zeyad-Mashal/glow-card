"use client";

import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "./nearby-map-modal.css";
import getNearbyFoundations from "@/API/Foundation/getNearbyFoundations.api";
import getAllInMapFoundations from "@/API/Foundation/getAllInMapFoundations.api";

const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh (fallback)

const NearbyMapMapLibreView = dynamic(
  () => import("./NearbyMapMapLibreView"),
  { ssr: false }
);

const NearbyMapModal = ({ open, onClose, lang }) => {
  const [center, setCenter] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setGeoError(null);
    setNearby([]);
    setCenter(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const load = useCallback(async () => {
    if (!navigator?.geolocation) {
      setCenter(defaultCenter);
      await getAllInMapFoundations(setLoading, setGeoError, setNearby);
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const c = { lat, lng };
        setCenter(c);

        await getNearbyFoundations(
          setLoading,
          setGeoError,
          setNearby,
          lat,
          lng
        );
      },
      async () => {
        setCenter(defaultCenter);
        setGeoError(
          lang === "ar"
            ? "تم عرض كل العيادات على الخريطة لأن إذن الموقع غير متاح."
            : "Showing all clinics on map because location permission is unavailable."
        );
        await getAllInMapFoundations(setLoading, setGeoError, setNearby);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, [lang]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  if (!open) return null;

  return (
    <div className="nearby_modal_overlay" role="presentation" onClick={onClose}>
      <div
        className="nearby_modal_shell"
        role="dialog"
        aria-modal="true"
        dir={lang === "ar" ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="nearby_modal_topbar">
          <div className="nearby_modal_title">{lang === "ar" ? "الخريطة" : "Map"}</div>
          <button
            type="button"
            className="nearby_modal_close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="nearby_modal_body">
          {geoError && <div className="nearby_modal_error">{geoError}</div>}

          {loading && !center && (
            <div className="nearby_modal_loading">
              {lang === "ar" ? "جاري تحديد موقعك..." : "Detecting your location..."}
            </div>
          )}

          <div className="nearby_map_wrapper">
            <NearbyMapMapLibreView
              center={center ?? defaultCenter}
              nearby={nearby}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyMapModal;

