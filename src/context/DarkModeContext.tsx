/*
    (C) Brackenbit 2024

    Inspired by code from "The Ultimate React Course 2024" by Jonas Schmedtmann
    https://github.com/jonasschmedtmann/ultimate-react-course
    Rewritten to use TypeScript and Bootstrap.
*/

import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
    undefined
);

function DarkModeProvider({ children }: PropsWithChildren) {
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(
        // Use OS preferences for default
        window.matchMedia("(prefers-color-scheme: dark)").matches,
        "isDarkMode"
    );

    function toggleDarkMode() {
        setIsDarkMode((isDark: boolean) => !isDark);
    }

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute("data-bs-theme", "dark");
        } else {
            document.documentElement.setAttribute("data-bs-theme", "light");
        }
    }, [isDarkMode]);

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error("DarkModeContext was used outside of a provider");
    }

    return context;
}

export { DarkModeProvider, useDarkMode };
