import React from "react";
import "./Navbar.css";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav_container">
        <div className="logo">
          <img src="/images/user.png" alt="Logo" className="logo-image" />
        </div>
        <div className="nav_links">
          <ul>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
          </ul>
        </div>

        <div className="nav_btns">
          <div className="search_div">
            <img src="/images/search.png" alt="" />
            <input type="text" placeholder="search" />
          </div>
          <img src="/images/cart.png" alt="" />
          <img src="/images/user.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
