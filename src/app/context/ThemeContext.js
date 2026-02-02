'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
    isDarkMode: false,
    toggleDarkMode: () => { },
    mounted: false,
});

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check localStorage for saved preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let shouldBeDark = false;
        if (savedTheme === 'dark') {
            shouldBeDark = true;
        } else if (savedTheme === 'light') {
            shouldBeDark = false;
        } else {
            shouldBeDark = prefersDark;
        }

        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        setIsDarkMode(shouldBeDark);
        setMounted(true);
    }, []);

    const toggleDarkMode = () => {
        const newValue = !isDarkMode;

        if (newValue) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        setIsDarkMode(newValue);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode: mounted ? isDarkMode : false, toggleDarkMode, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
