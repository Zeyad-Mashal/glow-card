"use client";

import React, { useCallback, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import Link from "next/link";

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[c] || c;
  });
}

function pickName(f) {
  return f?.name ?? f?.ar ?? f?.title ?? "";
}

function pickLogo(f) {
  if (Array.isArray(f?.images) && f.images.length > 0) return f.images[0];
  if (typeof f?.image === "string" && f.image.trim()) return f.image;
  return f?.logo ?? "/images/logo.png";
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
  const toNumber = (v) => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = Number.parseFloat(v);
      if (Number.isFinite(n)) return n;
    }
    return null;
  };

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
    const a = f.coordinates[0];
    const b = f.coordinates[1];
    const aN = toNumber(a);
    const bN = toNumber(b);
    if (aN != null && bN != null) return { lat: bN, lng: aN };
  }

  // GeoJSON: { location: { type: "Point", coordinates: [lng, lat] } }
  if (Array.isArray(f?.location?.coordinates) && f.location.coordinates.length >= 2) {
    const a = f.location.coordinates[0];
    const b = f.location.coordinates[1];
    const aN = toNumber(a);
    const bN = toNumber(b);
    if (aN != null && bN != null) return { lat: bN, lng: aN };
  }

  const mapUrl = f?.address?.[0]?.map ?? f?.map ?? f?.googleMap;
  const fromUrl = tryExtractLatLngFromMapUrl(mapUrl);
  if (fromUrl) return fromUrl;

  return null;
}

const NearbyMapLeafletView = ({ center, nearby, lang }) => {
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

  // (marker pins) intentionally not used for now; Tooltip shows logos/names reliably.

  return (
    <MapContainer
      key={`${center?.lat ?? "x"}-${center?.lng ?? "y"}`}
      center={center}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <CircleMarker
        center={center}
        radius={10}
        pathOptions={{
          color: "#26a69a",
          fillColor: "#26a69a",
          fillOpacity: 0.25,
        }}
      />

      {markers.map(({ foundation, pos }) => {
        const logo = pickLogo(foundation);
        const name = pickName(foundation);
        const id = foundation?._id ?? foundation?.id ?? "";

        return (
          <Marker
            key={id || `${name}-${pos.lat}-${pos.lng}`}
            position={pos}
          >
            <Tooltip
              direction="top"
              offset={[0, -10]}
              permanent
              className="nearby_tooltip"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: 14,
                  padding: "6px 8px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
                  border: "1px solid rgba(38, 166, 154, 0.35)",
                  direction: "rtl",
                }}
              >
                <img
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flex: "0 0 auto",
                  }}
                  src={logo}
                  alt=""
                />
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 900,
                    color: "#001f3f",
                    maxWidth: 140,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {name}
                </div>
              </div>
            </Tooltip>
            <Popup>
              <div className="nearby_popup">
                <img className="nearby_popup_logo" src={logo} alt={name} />
                <div className="nearby_popup_text">{name}</div>
                {id ? (
                  <div className="nearby_popup_link">
                            <Link href={`/foundation-details?id=${id}`}>
                              {lang === "ar" ? "عرض التفاصيل" : "View details"}
                            </Link>
                  </div>
                ) : null}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default NearbyMapLeafletView;

