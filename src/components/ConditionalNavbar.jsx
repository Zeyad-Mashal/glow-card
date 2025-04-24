"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const hideNavbarPaths = ["/login", "/verify-otp"];

  return !hideNavbarPaths.includes(pathname) ? <Navbar /> : null;
}
