"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGooglePlay,
  faApple,
} from "@fortawesome/free-brands-svg-icons";
import "./welcome-app-modal.css";

/** تاريخ آخر يوم تم فيه إغلاق النافذة — لا تُعرض مرة أخرى في نفس اليوم (توقيت الجهاز) */
const STORAGE_KEY = "glowcard_welcome_app_dismissed_date";

function localTodayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readDismissedDate() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeDismissedDate(dateKey) {
  try {
    localStorage.setItem(STORAGE_KEY, dateKey);
  } catch {
    /* ignore quota / private mode */
  }
}

/** Override with NEXT_PUBLIC_ANDROID_APP_URL / NEXT_PUBLIC_IOS_APP_URL in .env.local */
const ANDROID_APP_URL =
  process.env.NEXT_PUBLIC_ANDROID_APP_URL ??
  "https://play.google.com/store/apps/details?id=com.glowcard.app";
const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ??
  "https://apps.apple.com/app/id0000000000";

const WelcomeAppModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = readDismissedDate();
    if (dismissed === localTodayKey()) return;
    setOpen(true);
  }, []);

  const dismissForRestOfDay = useCallback(() => {
    writeDismissedDate(localTodayKey());
    setOpen(false);
  }, []);

  const handleDownloadClick = useCallback(() => {
    dismissForRestOfDay();
  }, [dismissForRestOfDay]);

  if (!open) return null;

  return (
    <div className="welcome_app_overlay" role="presentation">
      <div
        className="welcome_app_box welcome_app_animate"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-app-title"
        aria-describedby="welcome-app-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="welcome_app_close"
          aria-label="إغلاق"
          onClick={dismissForRestOfDay}
        >
          ×
        </button>
        <h2 id="welcome-app-title">مرحبًا بك في جلو كارد</h2>
        <p id="welcome-app-desc">
          حمّل التطبيق للحصول على تجربة أسرع وخصوماتك في جيبك.
        </p>
        <div className="welcome_app_actions">
          <a
            className="welcome_app_android"
            href={ANDROID_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
          >
            <FontAwesomeIcon icon={faGooglePlay} aria-hidden />
            تحميل من Google Play
          </a>
          <a
            className="welcome_app_ios"
            href={IOS_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
          >
            <FontAwesomeIcon icon={faApple} aria-hidden />
            تحميل من App Store
          </a>
        </div>
        <button
          type="button"
          className="welcome_app_later"
          onClick={dismissForRestOfDay}
        >
          لاحقًا
        </button>
      </div>
    </div>
  );
};

export default WelcomeAppModal;
