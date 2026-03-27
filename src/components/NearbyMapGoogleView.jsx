"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  GoogleMap,
  MarkerF,
  OverlayView,
  CircleF,
  useJsApiLoader,
} from "@react-google-maps/api";

function toNumber(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number.parseFloat(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function tryExtractLatLngFromMapUrl(mapUrl) {
  const s = String(mapUrl ?? "");
  const m1 = s.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (m1?.[1] && m1?.[2]) return { lat: Number(m1[1]), lng: Number(m1[2]) };
  const m2 = s.match(/[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (m2?.[1] && m2?.[2]) return { lat: Number(m2[1]), lng: Number(m2[2]) };
  return null;
}

function getLatLng(f) {
  const latRaw =
    f?.lat ??
    f?.latitude ??
    f?.location?.lat ??
    f?.location?.latitude ??
    f?.coords?.lat ??
    f?.coordinates?.lat;
  const lngRaw =
    f?.lng ??
    f?.longitude ??
    f?.location?.lng ??
    f?.location?.longitude ??
    f?.coords?.lng ??
    f?.coordinates?.lng;

  const lat = toNumber(latRaw);
  const lng = toNumber(lngRaw);
  if (lat != null && lng != null) return { lat, lng };

  if (Array.isArray(f?.coordinates) && f.coordinates.length >= 2) {
    // Many APIs use [lng, lat]
    const aN = toNumber(f.coordinates[0]);
    const bN = toNumber(f.coordinates[1]);
    if (aN != null && bN != null) return { lat: bN, lng: aN };
  }

  // GeoJSON: { location: { type: "Point", coordinates: [lng, lat] } }
  if (Array.isArray(f?.location?.coordinates) && f.location.coordinates.length >= 2) {
    const aN = toNumber(f.location.coordinates[0]);
    const bN = toNumber(f.location.coordinates[1]);
    if (aN != null && bN != null) return { lat: bN, lng: aN };
  }

  const mapUrl = f?.address?.[0]?.map ?? f?.map ?? f?.googleMap;
  return tryExtractLatLngFromMapUrl(mapUrl);
}

function pickName(f) {
  return f?.name ?? f?.ar ?? f?.title ?? "";
}

function pickImage(f) {
  if (typeof f?.image === "string" && f.image.trim()) return f.image;
  if (Array.isArray(f?.images) && f.images.length > 0) return f.images[0];
  return f?.logo ?? "/images/logo.png";
}

const NearbyMapGoogleView = ({ center, nearby, lang }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  const markers = useMemo(() => {
    if (!Array.isArray(nearby) || nearby.length === 0) return [];
    return nearby
      .map((f) => {
        const pos = getLatLng(f);
        if (!pos) return null;
        return { foundation: f, pos };
      })
      .filter(Boolean);
  }, [nearby]);

  if (!apiKey) {
    return (
      <div className="nearby_modal_error" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
        {lang === "ar"
          ? "مفتاح Google Maps غير مُعرّف. أضف NEXT_PUBLIC_GOOGLE_MAPS_API_KEY في ملف البيئة."
          : "Google Maps key missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment."}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="nearby_modal_error" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
        {lang === "ar" ? "فشل تحميل الخريطة." : "Failed to load map."}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="nearby_modal_loading" style={{ position: "relative", top: 0, left: 0, transform: "none" }}>
        {lang === "ar" ? "جاري تحميل الخريطة..." : "Loading map..."}
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={15}
      options={{
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: false,
        gestureHandling: "greedy",
      }}
    >
      <CircleF
        center={center}
        radius={120}
        options={{
          strokeColor: "#26a69a",
          strokeOpacity: 0.65,
          strokeWeight: 2,
          fillColor: "#26a69a",
          fillOpacity: 0.18,
        }}
      />
      <MarkerF position={center} />

      {markers.map(({ foundation, pos }) => {
        const image = pickImage(foundation);
        const name = pickName(foundation);
        const id = foundation?._id ?? foundation?.id ?? "";
        const key = id || `${name}-${pos.lat}-${pos.lng}`;

        return (
          <React.Fragment key={key}>
            <MarkerF position={pos} />
            <OverlayView position={pos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <div className="nearby_gmarker" dir={lang === "ar" ? "rtl" : "ltr"}>
                <img className="nearby_gmarker_logo" src={image} alt="" />
                <div className="nearby_gmarker_name" title={name}>
                  {name}
                </div>
                {id ? (
                  <Link className="nearby_gmarker_link" href={`/foundation-details?id=${id}`}>
                    {lang === "ar" ? "تفاصيل" : "Details"}
                  </Link>
                ) : null}
              </div>
            </OverlayView>
          </React.Fragment>
        );
      })}
    </GoogleMap>
  );
};

export default NearbyMapGoogleView;

