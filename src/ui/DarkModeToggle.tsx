/*
    (C) Brackenbit 2024
*/

import { Button } from "react-bootstrap";
import { useDarkMode } from "../context/DarkModeContext";

export default function DarkModeToggle() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <Button
            onClick={toggleDarkMode}
            variant="outline-secondary"
            aria-label={isDarkMode ? "Turn off dark mode" : "Turn on dark mode"}
        >
            {isDarkMode ? (
                <i className="bi bi-sun" />
            ) : (
                <i className="bi bi-moon-fill" />
            )}
        </Button>
    );
}
