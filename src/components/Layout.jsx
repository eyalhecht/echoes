import React from 'react';
import { Box } from '@mui/material';

import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import MainContent from "./MainContent.jsx";

const HEADER_HEIGHT = 40;

export default function Layout() {
    return (
        <Box>
            <Header height={HEADER_HEIGHT} />
            <Sidebar />
            <MainContent />
        </Box>
    );
}
