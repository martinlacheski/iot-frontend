import { createTheme } from "@mui/material";

export const slateTheme = createTheme({
    palette: {
        primary: {
            main: "#334155",        // slate-700
        },
        secondary: {
            main: "#94a3b8",        // slate-400
        },
        light: {
            main: "#e2e8f0",        // slate-200
            alt: "#f1f5f9",         // slate-100
        },
        background: {
            main: "#0f172a",        // slate-900
        },
        error: {
            main: "#dc2626",        // red-600
        }
    }
});