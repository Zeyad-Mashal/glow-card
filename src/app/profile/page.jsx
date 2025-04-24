import React from "react";
import "./profile.css";
const Profile = () => {
  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_controller">
          <div className="profile_img">
            <img src="/images/logo.png" alt="" />
          </div>
          <h2>Zeyad Mashaal</h2>
          <div className="controller_tabs">
            <div className="controller_tab">Card Info</div>
            <div className="controller_tab">Invitation link</div>
            <div className="controller_tab">Log Out</div>
          </div>
        </div>
        <div className="profile_content">
          <div className="profile_content_card">
            <h2>Card Info</h2>
            <div className="card_info">
              <img src="/images/cardfront.png" alt="" />
              <div className="card_info_item">
                <h3>Personal Card</h3>
                <p>Zeyad Mashaal</p>
                <div className="card_info_item_date">
                  <span>12 / 4 / 2024</span>
                  <p>subscription date was </p>
                </div>
                <div className="card_info_item_date">
                  <span>12 / 4 / 2024</span>
                  <p>Expire date at </p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="profile_content_card">
            <h2>Invitation Link</h2>
            <div className="invitation_link">
              <p>https://example.com/invite/123456</p>
              <button>Copy</button>
            </div>
          </div>
          <div className="profile_content_card">
            <h2>Log Out</h2>
            <button className="logout_button">Log Out</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
