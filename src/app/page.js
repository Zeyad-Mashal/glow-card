// src/app/page.js
"use client";

import Image from "next/image";
import Head from "next/head"; // or just use the layout.js in app directory
import Link from "next/link";
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


      <Link href="/login" className="m-5">login</Link>
      <Link href="/otp">otp</Link>

    </>
  );
}
