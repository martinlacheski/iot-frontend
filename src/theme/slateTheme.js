import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const slateTheme = createTheme({
    palette: {
        primary: {
            main: "#334155",
        },
        secondary: {
            main: "#94a3b8",
        },
        error: {
            main: red.A400,
        }
    }
});