import {useSelector} from "react-redux";
import {Box, styled, Typography, useTheme} from "@mui/material";
import Home from "./Home.jsx";
import UploadPost from "./UploadPost.jsx";
import MemphisBackgroundPattern from "./MemphisBackgroundPattern.jsx";
import React from "react";


const HEADER_HEIGHT = 40;
const SIDEBAR_WIDTH = 220;

// --- STYLED COMPONENT for MainContent's overall container ---
const StyledMainContentContainer = styled(Box)(({ theme }) => ({
    marginLeft: `${SIDEBAR_WIDTH}px`,
    marginTop: `${HEADER_HEIGHT}px`,
    minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
    padding: '20px',
    position: 'relative', // Needed for absolute positioning of background elements
    overflow: 'hidden', // Hide overflow from background patterns
    backgroundColor: '#f8f8f8', // Off-white for a softer feel
}));

function MainContent() {
    const activeSidebarItem = useSelector(state => state.ui.activeSidebarItem);

    const renderContent = () => {
        switch (activeSidebarItem) {
            case 'Home':
                return <Home />;
            case 'Profile':
                return (
                    <Typography>
                        PROFILE PAGE COMING SOON...
                    </Typography>
                );
            case 'Friends':
                return (
                    <Typography >
                        FRIENDS PAGE COMING SOON...
                    </Typography>
                );
            case 'Upload':
                return <UploadPost></UploadPost>;
            case 'Settings':
                return (
                    <Typography>
                        SETTINGS PAGE COMING SOON...
                    </Typography>
                );
            default:
                return <Home />;
        }
    };

    return (
        <StyledMainContentContainer>
            <MemphisBackgroundPattern />

            <Typography
                sx={{
                    fontFamily: '"Arial Black", sans-serif',
                    fontSize: '15rem', // Very large
                    fontWeight: 'bold',
                    color: '#000',
                    opacity: 0.05, // Very subtle
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: -1, // Ensure it's behind content
                    userSelect: 'none',
                    pointerEvents: 'none', // Make sure it doesn't interfere with clicks
                    textShadow: '8px 8px 0px #FF69B4', // Deep pink offset shadow
                }}
            >
                SOCIAL
            </Typography>

            {/* Content rendered by switch case */}
            {/* Using a relative Box for content ensures it sits above the absolute background shapes */}
            <Box sx={{ position: 'relative', zIndex: 1, p: 2 }}>
                {renderContent()}
            </Box>
        </StyledMainContentContainer>
    );
}

// Export MainContent for use in Layout
export default MainContent;