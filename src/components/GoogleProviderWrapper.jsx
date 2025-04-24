"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProviderWrapper({ children }) {
  return (
    <GoogleOAuthProvider clientId="31046184876-iig03eimat2l3huicqt3jo5kgj94pdp8.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
