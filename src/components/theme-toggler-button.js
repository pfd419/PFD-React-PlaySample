import React, { useContext, useReducer, useEffect } from "react";
import { ThemeContext, themes } from '../contexts/ThemeContext';

function toggleThemeReducer(state, action) {
    switch (action.type) {
        case "toggle": {
            return state.name === themes.dark.name
                ? themes.light
                : themes.dark;
        }
        case "light": {
            return themes.light;
        }
        case "dark": {
            return themes.dark;
        }
        default: {
            throw new Error("Unhandled type: {action.type}");
        }
    }
}

function useToggleTheme({ reducer = (s, a) => a.changes } = {}) {
    const themeContext = useContext(ThemeContext);

    const [selectedTheme, dispatch] = useReducer(
        (state, action) => {
            const changes = toggleThemeReducer(state, action);
            return reducer(state, { ...action, changes })
        },
        themeContext.selectedTheme
    );

    const toggle = () => dispatch({ type: "toggle" });
    const setLight = () => dispatch({ type: "light" });
    const setDark = () => dispatch({ type: "dark" });

    return { selectedTheme, toggle, setLight, setDark }
}


export default function ThemeTogglerButton() {
    const themeContext = useContext(ThemeContext);
    const { selectedTheme, toggle, setLight, setDark } = useToggleTheme({
        reducer(selectedTheme, action) {
            return action.changes;
        }
    });

    // Pass new state via context when selectedTheme has changed
    useEffect(() => {
        if (themeContext.selectedTheme !== selectedTheme) {
            themeContext.setSelectedTheme(selectedTheme);
        }
    });

    return (
        <section>
            <button onClick={setLight} style={selectedTheme}>Set Light</button>
            <button onClick={setDark} style={selectedTheme}>Set Dark</button>
            <button onClick={toggle} style={selectedTheme}>
                Toggle Theme
            </button>
        </section>
    );
}
