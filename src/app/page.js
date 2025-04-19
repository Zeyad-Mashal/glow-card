// src/app/page.js
"use client";

import Head from "next/head"; // or just use the layout.js in app directory
import Hero from "@/components/Hero";
import Banner from "@/components/Banner";
import Features from "@/components/Features";
import GlowCards from "@/components/GlowCards";
import CardOrder from "@/components/CardOrder";
import Footer from "@/components/Footer";
export default function Home() {

  return (
    <>
      <Head>
        <title>Home - Glow Card</title>
        <meta name="description" content="Find the best deals on electronics and more." />
        <link rel="canonical" href="https://www.myecom.com/" />
        <meta property="og:title" content="Home - Glow Card" />
        <meta property="og:description" content="Glow Card" />
        <meta property="og:url" content="https://vercel.com/zeyad-mashaals-projects/glow-card" />
        <meta property="og:site_name" content="Glow Card" />
      </Head>


      <Hero />
      <Banner />
      <Features />
      <CardOrder />
      <GlowCards />
      <Footer />

    </>
  );
}
