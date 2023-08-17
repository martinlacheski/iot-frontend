import { AppRouter } from "./router/AppRouter";
import { AppTheme } from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <AppTheme>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppRouter />
      </LocalizationProvider>
    </AppTheme>
  );
}

export default App;
