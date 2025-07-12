import React from "react";
import "./PaymentError.css";
const page = () => {
  return (
    <div className="payment_callBack">
      <div className="payment_callBack_container">
        <div className="status error">
          <div className="icon error-icon">&#10006;</div>
          <h2>فشل في عملية الدفع</h2>
          <p>يرجى استخدام بطاقة مختلفة</p>
        </div>
      </div>
    </div>
  );
};

export default page;
