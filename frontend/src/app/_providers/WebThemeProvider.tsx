"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
} from "react";
import type { ResolvedWebTheme, WebTheme } from "@/app/_types";

type WebThemeContextValue = {
    theme: WebTheme;
    resolvedTheme: ResolvedWebTheme;
    setTheme: (theme: WebTheme) => void;
    toggleTheme: () => void;
};

type WebThemeProviderProps = {
    initialTheme: WebTheme;
    initialResolvedTheme: ResolvedWebTheme;
    children: React.ReactNode;
};

const WebThemeContext = createContext<WebThemeContextValue | null>(null);

function getSystemTheme(): ResolvedWebTheme {
    if(typeof window === "undefined") {
        return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function setThemeCookie(theme: WebTheme) {
    document.cookie = `webTheme=${theme}; path=/; max-age=31536000; samesite=lax`;
}

function applyTheme(theme: ResolvedWebTheme) {
    document.documentElement.dataset.theme = theme;
}

function subscribeToSystemTheme(onStoreChange: () => void) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", onStoreChange);

    return () => {
        mediaQuery.removeEventListener("change", onStoreChange);
    };
}

export function WebThemeProvider({
                                     initialTheme,
                                     initialResolvedTheme,
                                     children,
                                 }: WebThemeProviderProps) {
    const [theme, setThemeState] = useState<WebTheme>(initialTheme);
    const systemTheme = useSyncExternalStore(
        subscribeToSystemTheme,
        getSystemTheme,
        () => initialResolvedTheme,
    );
    const resolvedTheme = useMemo(
        () => theme === "auto" ? systemTheme : theme,
        [theme, systemTheme],
    );

    useEffect(() => {
        applyTheme(resolvedTheme);
    }, [resolvedTheme]);

    const setTheme = useCallback((nextTheme: WebTheme) => {
        setThemeState(nextTheme);
        setThemeCookie(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }, [resolvedTheme, setTheme]);

    const value = useMemo<WebThemeContextValue>(() => ({
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
    }), [theme, resolvedTheme, setTheme, toggleTheme]);

    return (
        <WebThemeContext.Provider value={value}>
            {children}
        </WebThemeContext.Provider>
    );
}

export function useWebTheme() {
    const context = useContext(WebThemeContext);

    if(context === null) {
        throw new Error("useWebTheme must be used inside WebThemeProvider");
    }

    return context;
}
