import React from "react";
import "./New.css";
const page = () => {
  return (
    <div className="new">
      <div className="new_container">
        <h1>انضم حديثا</h1>
        <p>
          This is the new page. It is currently under construction. Please check
          back later for updates.
        </p>
        <div className="new_list">
          <div className="new_item">
            <img src="/images/network1.jpeg" alt="new comes" />
            <h2>New Network</h2>
          </div>
          <div className="new_item">
            <img src="/images/network1.jpeg" alt="new comes" />
            <h2>New Network</h2>
          </div>
          <div className="new_item">
            <img src="/images/network1.jpeg" alt="new comes" />
            <h2>New Network</h2>
          </div>
          <div className="new_item">
            <img src="/images/network1.jpeg" alt="new comes" />
            <h2>New Network</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
