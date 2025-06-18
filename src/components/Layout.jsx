import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveSidebarItem } from '../store/slices/uiSlice';
import { Box } from '@mui/material';
import Header from './Header.jsx';
import Home from './Home.jsx';

const HEADER_HEIGHT = 40;

function Sidebar() {
    const activeSidebarItem = useSelector(state => state.ui.activeSidebarItem);
    const dispatch = useDispatch();
    const items = ['Home', 'Profile', 'Friends', 'Messages', 'Settings'];

    return (
        <Box sx={{
            width: '200px',
            height: '100vh',
            backgroundColor: 'white',
            position: 'fixed',
            left: 0,
            top: HEADER_HEIGHT,
            borderRight: '1px solid #ddd'
        }}>
            {items.map((item) => (
                <Box
                    key={item}
                    onClick={() => dispatch(setActiveSidebarItem(item))}
                    sx={{
                        padding: '16px',
                        cursor: 'pointer',
                        backgroundColor: activeSidebarItem === item ? '#e3f2fd' : 'transparent',
                    }}
                >
                    {item}
                </Box>
            ))}
        </Box>
    );
}

function MainContent() {
    const activeSidebarItem = useSelector(state => state.ui.activeSidebarItem);
    console.log(activeSidebarItem);

    const renderContent = () => {
        switch (activeSidebarItem) {
            case 'Home':
                return <Home />;
            case 'Profile':
                return <Box>Profile Page Coming Soon...</Box>;
            case 'Friends':
                return <Box>Friends Page Coming Soon...</Box>;
            case 'Messages':
                return <Box>Messages Page Coming Soon...</Box>;
            case 'Settings':
                return <Box>Settings Page Coming Soon...</Box>;
            default:
                return <Home />;
        }
    };

    return (
        <Box sx={{
            marginLeft: '200px',
            marginTop: `${HEADER_HEIGHT}px`,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            {renderContent()}
        </Box>
    );
}

export default function Layout() {
    return (
        <Box>
            <Header height={HEADER_HEIGHT} />
            <Sidebar />
            <MainContent />
        </Box>
    );
}
