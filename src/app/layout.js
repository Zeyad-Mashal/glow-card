import Navbar from "@/components/Navbar";
import "./globals.css";
export const metadata = {
  title: "Glow Card",
  description: "Hello, I'm Glow Card. I am a digital business card.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html >
  );
}
