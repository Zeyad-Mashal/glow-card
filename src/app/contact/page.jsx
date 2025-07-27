import React from "react";
import "./contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
const page = () => {
  return (
    <div className="contact">
      <div className="contact_container">
        <h1>تواصل معنا</h1>
        <p>
          نحن هنا من أجلك! لا تتردد في التواصل مع فريقنا الودود في أي وقت —
          يسعدنا إرشادك، والإجابة على أسئلتك، ومساعدتك في البدء بتوفير تكاليف
          الرعاية الصحية اليوم.
        </p>
        <div className="contact_content">
          <div className="content_text">
            <h3>جاهز تبدء تستخدم بطاقتك ؟</h3>
            <p>
              دعنا نحول رؤيتك إلى واقع. تواصل معنا اليوم لنتحدث عن كيفية مساعدتك
              على الابتكار والنمو.
            </p>
            <div className="content_text_info">
              <h2>طرق التواصل</h2>
              <p>
                <FontAwesomeIcon icon={faPhone} />{" "}
                <a href="tel:++966512345678">512345678 966+ </a>
              </p>
              <p>
                <FontAwesomeIcon icon={faLocationDot} /> السعوديه, الرياض
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} />
                <a href="mailto:+zyadomar112@gmail.com">glowcard1@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="content_form">
            <label>الاسم بالكامل</label>
            <input type="text" placeholder="الاسم" />
            <label>الايميل</label>
            <input type="text" placeholder="الايميل" />
            <label>رسالتك لنا</label>
            <textarea placeholder="رسالتك لنا"></textarea>
            <button>ارسال</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
