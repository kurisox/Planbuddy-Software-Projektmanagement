import { useEffect } from 'react';

const ThemeToggle = () => {

    const getDefaultTheme = () => {
        const selectedTheme = localStorage.getItem('theme');
        localStorage.setItem("theme", selectedTheme || "light");
        return selectedTheme || 'light'
    }

    useEffect(() => {
        document
            .getElementsByTagName("HTML")[0]
            .setAttribute("data-theme", getDefaultTheme());
    }, []);

    return (
        <div></div>
    )
}

export default ThemeToggle;