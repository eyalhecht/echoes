import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/index.js'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </Provider>
  </StrictMode>,
)
