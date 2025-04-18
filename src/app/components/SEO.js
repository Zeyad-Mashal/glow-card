// src/components/SEO.js
import { NextSeo } from 'next-seo';

const SEO = ({ title, description, canonical }) => (
    <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
            url: canonical,
            title,
            description,
            site_name: 'Glow Card',
        }}
    />
);

export default SEO;
