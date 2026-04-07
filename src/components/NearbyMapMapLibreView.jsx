"use client";

import React, { useEffect, useMemo, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

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

function distanceScore(a, b) {
  const dLat = a.lat - b.lat;
  const dLng = a.lng - b.lng;
  return dLat * dLat + dLng * dLng;
}

function pickBestCandidate(candidates, center) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  if (!center) return candidates[0];
  let best = candidates[0];
  let bestScore = distanceScore(best, center);
  for (let i = 1; i < candidates.length; i += 1) {
    const score = distanceScore(candidates[i], center);
    if (score < bestScore) {
      best = candidates[i];
      bestScore = score;
    }
  }
  return best;
}

function getLatLng(f, center) {
  const mapUrl = f?.address?.[0]?.map ?? f?.map ?? f?.googleMap;
  const fromMapUrl = tryExtractLatLngFromMapUrl(mapUrl);
  if (fromMapUrl) return fromMapUrl;

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

  const candidates = [];

  if (Array.isArray(f?.coordinates) && f.coordinates.length >= 2) {
    const aN = toNumber(f.coordinates[0]);
    const bN = toNumber(f.coordinates[1]);
    if (aN != null && bN != null) {
      // Some records store [lng, lat], others are accidentally [lat, lng].
      candidates.push({ lat: bN, lng: aN });
      candidates.push({ lat: aN, lng: bN });
    }
  }

  if (Array.isArray(f?.location?.coordinates) && f.location.coordinates.length >= 2) {
    const aN = toNumber(f.location.coordinates[0]);
    const bN = toNumber(f.location.coordinates[1]);
    if (aN != null && bN != null) {
      candidates.push({ lat: bN, lng: aN });
      candidates.push({ lat: aN, lng: bN });
    }
  }

  return pickBestCandidate(candidates, center);
}

function pickName(f) {
  return f?.name ?? f?.ar ?? f?.title ?? "";
}

function pickImage(f) {
  if (typeof f?.image === "string" && f.image.trim()) return f.image;
  if (Array.isArray(f?.images) && f.images.length > 0) return f.images[0];
  return f?.logo ?? "/images/logo.png";
}

function formatDistance(distance, lang) {
  const d = toNumber(distance);
  if (d == null) return "";
  const value = Number.isInteger(d) ? String(d) : d.toFixed(1);
  return lang === "ar" ? `${value} كيلو متر` : `${value} km`;
}

const NearbyMapMapLibreView = ({ center, nearby, lang }) => {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const clinicMarkersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const markers = useMemo(() => {
    if (!Array.isArray(nearby) || nearby.length === 0) return [];
    return nearby
      .map((f) => {
        const pos = getLatLng(f, center);
        if (!pos) return null;
        return { foundation: f, pos };
      })
      .filter(Boolean);
  }, [nearby, center]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapNodeRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [center.lng, center.lat],
      zoom: 14,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    return () => {
      clinicMarkersRef.current.forEach((m) => m.remove());
      clinicMarkersRef.current = [];
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [center.lat, center.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({ center: [center.lng, center.lat], zoom: 14, essential: true });
  }, [center.lat, center.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    userMarkerRef.current?.remove();
    const userEl = document.createElement("div");
    userEl.className = "nearby_maplibre_user_pin";
    userMarkerRef.current = new maplibregl.Marker({ element: userEl })
      .setLngLat([center.lng, center.lat])
      .addTo(map);
  }, [center.lat, center.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    clinicMarkersRef.current.forEach((m) => m.remove());
    clinicMarkersRef.current = [];

    markers.forEach(({ foundation, pos }) => {
      const image = pickImage(foundation);
      const name = pickName(foundation);
      const distanceText = formatDistance(foundation?.distance, lang);
      const id = foundation?._id ?? foundation?.id ?? "";

      const card = document.createElement("div");
      card.className = "nearby_maplibre_marker";
      card.dir = lang === "ar" ? "rtl" : "ltr";
      card.innerHTML = `
        <img class="nearby_maplibre_marker_logo" src="${image}" alt="" />
        <div class="nearby_maplibre_marker_content">
          <div class="nearby_maplibre_marker_name">${name}</div>
          ${
            distanceText
              ? `<div class="nearby_maplibre_marker_distance">${distanceText}</div>`
              : ""
          }
        </div>
      `;

      const marker = new maplibregl.Marker({ element: card, anchor: "bottom" })
        .setLngLat([pos.lng, pos.lat])
        .addTo(map);

      if (id) {
        card.style.cursor = "pointer";
        card.onclick = () => {
          window.location.href = `/foundation-details?id=${id}`;
        };
      }

      clinicMarkersRef.current.push(marker);
    });
  }, [markers, lang]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapNodeRef} style={{ width: "100%", height: "100%" }} />
      <div className="nearby_maplibre_hint">
        {lang === "ar" ? "عرض عيادات قريبة" : "Nearby clinics"}
      </div>
    </div>
  );
};

export default NearbyMapMapLibreView;

