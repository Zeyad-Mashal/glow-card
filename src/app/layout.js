import CityPopup from "@/components/CityPopup";
import WelcomeAppModal from "@/components/WelcomeAppModal";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import GoogleProviderWrapper from "@/components/GoogleProviderWrapper";
import WhatsappButton from "@/components/WhatsappButton";

export const metadata = {
  title: "عضوية المشاهير في الجمال والصحة — خصومات حتى 80% | جلو كارد",
  description:
    "احصلي على عضوية جلو كارد واستمتعي بخصومات تصل إلى 80% في شبكة عيادات الجمال والأسنان والليزر والجلدية المتنامية. عضوية رقمية بـ 299 ريال سنوياً. فعّلي عضويتك الآن.",
  openGraph: {
    title: "عضوية المشاهير في الجمال والصحة — خصومات حتى 80% | جلو كارد",
    description:
      "احصلي على عضوية جلو كارد واستمتعي بخصومات تصل إلى 80% في شبكة عيادات الجمال والأسنان والليزر والجلدية المتنامية. عضوية رقمية بـ 299 ريال سنوياً. فعّلي عضويتك الآن.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body>
        <GoogleProviderWrapper>
          <ConditionalNavbar />
          <CityPopup />
          <WelcomeAppModal />
          {children}
          <WhatsappButton />
        </GoogleProviderWrapper>
      </body>
    </html>
  );
}
