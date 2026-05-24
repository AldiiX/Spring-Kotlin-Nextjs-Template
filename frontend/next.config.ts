import type { NextConfig } from "next";
import { createHash } from "crypto";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { WebpackRule } from "./next.config.types";

function getHashedCssModuleClass(context: { resourcePath: string }, _localIdentName: string, localName: string) {
    const hash = createHash("sha256")
        .update(`${context.resourcePath}:${localName}`)
        .digest("base64url")
        .slice(0, 11);
    const firstLetter = String.fromCharCode(97 + (hash.charCodeAt(0) % 26));

    return `${firstLetter}${hash}`;
}

function applyProductionCssModuleHashing(rule: WebpackRule) {
    for (const nestedRule of rule.oneOf ?? []) {
        applyProductionCssModuleHashing(nestedRule);
    }

    for (const nestedRule of rule.rules ?? []) {
        applyProductionCssModuleHashing(nestedRule);
    }

    if (!Array.isArray(rule.use)) {
        return;
    }

    for (const loader of rule.use) {
        if (!loader.loader?.includes("css-loader") || !loader.options?.modules?.getLocalIdent) {
            continue;
        }

        loader.options.modules.getLocalIdent = getHashedCssModuleClass;
    }
}

const nextConfig: NextConfig = {
    // Route API calls to the ASP.NET backend during local development.
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:41520/api/:path*",
            },
        ];
    },

    webpack(config, { dev }) {
        // Hash CSS module class names in production for better caching and smaller bundles.
        if (!dev) {
            for (const rule of config.module.rules as WebpackRule[]) {
                applyProductionCssModuleHashing(rule);
            }
        }

        return config;
    },
};

export default async function config(phase: string) {
    if (phase !== PHASE_DEVELOPMENT_SERVER) {
        return nextConfig;
    }

    const Inspector = (await import("interactive-react-inspector")).default;

    return Inspector.next(nextConfig);
}
