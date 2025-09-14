"use client";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsappButton.css";
export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/966542220888" // غير الرقم لرقمك
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp_float"
    >
      <FaWhatsapp size={30} />
    </a>
  );
}
