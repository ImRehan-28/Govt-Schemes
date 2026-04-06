import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#1a237e" },
    secondary: { main: "#f57c00" },
    background: { default: "#f0f4ff" },
  },
  typography: {
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  shape: { borderRadius: 8 },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
