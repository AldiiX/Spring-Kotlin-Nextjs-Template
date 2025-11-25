import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,

    // reverse proxy to backend
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:41520/api/:path*",
            },
        ];
    }
};

export default nextConfig;