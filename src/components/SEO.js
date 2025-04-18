"use client";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";

export default function SEO({ title, description, canonical }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Prevent SSR rendering issues with `useContext`
    }

    return (
        <NextSeo
            title={title}
            description={description}
            canonical={canonical}
            openGraph={{
                url: canonical,
                title: title,
                description: description,
                site_name: "Glow Card",
            }}
        />
    );
}
