import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        // Add real image domains (without https:// or paths)
        domains: ['glow-card.vercel.app'], // or your actual CDN/image hosting domain
    },
};

// Wrap config with Flowbite React
export default withFlowbiteReact(nextConfig);
