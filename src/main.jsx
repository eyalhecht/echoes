import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {LoadScript} from "@react-google-maps/api";
import { ThemeProvider as ShadcnThemeProvider } from "@/components/theme-provider"
import MapLoadingState from "@/components/MapLoadingState.jsx"

const theme = createTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_MAPS_API_KEY}
                    loadingElement={<MapLoadingState />}
                >
                    <ShadcnThemeProvider defaultTheme="light" storageKey="echoes-ui-theme">
                    <App />
                    </ShadcnThemeProvider>
                </LoadScript>
            </ThemeProvider>
        </BrowserRouter>
  </StrictMode>,
)
