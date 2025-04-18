import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['glow-card.vercel.app'], // or your actual CDN/image hosting domain
        unoptimized: true,
    },
};

// Wrap config with Flowbite React
export default withFlowbiteReact(nextConfig);
