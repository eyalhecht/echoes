import React from 'react';
import { Box, Typography } from '@mui/material';

function Bookmarks() {
    return (
        <Box sx={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            padding: '20px',
            textAlign: 'center'
        }}>
            <Typography variant="h4" gutterBottom>
                Bookmarks
            </Typography>
            <Typography variant="body1">
                Bookmarks page coming soon...
            </Typography>
        </Box>
    );
}

export default Bookmarks;
