import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_logo">
        <img src="/images/logo.png" alt="" loading="lazy" />
      </div>
      <div className="footer_section1">
        <h1>Company Info</h1>
        <p>About Us</p>
        <p>Carrier</p>
        <p>We are hiring</p>
      </div>
      <div className="footer_section1">
        <h1>Company Info</h1>
        <p>About Us</p>
        <p>Carrier</p>
        <p>We are hiring</p>
      </div>
      <div className="footer_section1">
        <h1>Get In Touch</h1>
        <p>
          <FontAwesomeIcon icon={faPhone} /> (480) 555-0103
        </p>
        <p>
          <FontAwesomeIcon icon={faLocationDot} /> 4517 Washington Ave.
          Manchester, Kentucky 39495
        </p>
        <p>
          <FontAwesomeIcon icon={faEnvelope} /> debra.holt@example.com
        </p>
      </div>
    </div>
  );
};

export default Footer;
