import React from "react";
import "./Join.css";
const Join = () => {
  return (
    <div className="join">
      <div className="join_container">
        <h1>انضم الي الشبكه</h1>
        <div className="join_list">
          <div className="join_form">
            <label>
              <span>اسم</span>
              <input type="text" placeholder="اسم" className="join_input" />
            </label>
            <label>
              <span>رقم الجوال</span>
              <input
                type="text"
                placeholder="05XXX XXX"
                className="join_input"
              />
            </label>
            <label>
              <span>البريد الالكتروني</span>
              <input
                type="email"
                placeholder="glowcard@gmail.com"
                className="join_input"
              />
            </label>
            <label>
              <span>المدينه</span>
              <select>
                <option value="اختر المدينه">اختر المدينه</option>
                <option value="اختر المدينه">الرياض</option>
                <option value="اختر المدينه">جده</option>
              </select>
            </label>
            <label>
              <span>التخصصات:</span>
              <div className="category">
                <input type="checkbox" />
                <span>تخصص 1</span>
              </div>
              <div className="category">
                <input type="checkbox" />
                <span>تخصص 1</span>
              </div>
              <div className="category">
                <input type="checkbox" />
                <span>تخصص 1</span>
              </div>
              <div className="category">
                <input type="checkbox" />
                <span>تخصص 1</span>
              </div>
            </label>
            <button>ارسال طلب</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
