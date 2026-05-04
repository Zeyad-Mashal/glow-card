'use client'
import WelcomeAppModal from "@/components/WelcomeAppModal";
import Hero from "@/components/Hero";
import Banner from "@/components/Banner";
import Features from "@/components/Features";
import GlowCards from "@/components/GlowCards";
import Footer from "@/components/Footer";
import Banner2 from "@/components/Banner2";
import Banner3 from "@/components/Banner3";
import HowItWorksSection from "@/components/HowItWorksSection";
import WhyGlowCard from "@/components/WhyGlowCard";
import FinalCTA from "@/components/FinalCTA";
export default function Home() {

  return (
    <>
      <WelcomeAppModal />
      <Hero />
      <Banner />
      <Banner2 />
      <Features />
      <Banner3 />
      <HowItWorksSection />
      <WhyGlowCard />
      <GlowCards />
      <FinalCTA />
      <Footer />
    </>
  );
}
