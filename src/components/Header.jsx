import React from 'react';

function Header({height}) {
    return (
        <div style={{
            height: height + 'px',
            backgroundColor: '#1877f2',
            color: 'white',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                SocialApp
            </div>
            
            <div style={{ 
                flex: 1, 
                maxWidth: '400px', 
                margin: '0 20px' 
            }}>
                <input 
                    type="text" 
                    placeholder="Search..." 
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px'
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}>
                    Notifications
                </div>
                <div style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}>
                    Profile
                </div>
            </div>
        </div>
    );
}

export default Header;
