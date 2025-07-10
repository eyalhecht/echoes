import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {LoadScript} from "@react-google-maps/api";

const theme = createTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_API_KEY}>
                    <CssBaseline />
                     <App />
                </LoadScript>
            </ThemeProvider>
        </BrowserRouter>
  </StrictMode>,
)
