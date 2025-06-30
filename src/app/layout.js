import CityPopup from "@/components/CityPopup";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import GoogleProviderWrapper from "@/components/GoogleProviderWrapper";

export const metadata = {
  title: "Glow Card",
  description: "Hello, I'm Glow Card. I am a digital business card.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleProviderWrapper>
          <ConditionalNavbar />
          <CityPopup />
          {children}
        </GoogleProviderWrapper>
      </body>
    </html>
  );
}
