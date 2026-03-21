import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from './theme-provider';
import { palette, alpha } from '../styles/theme';
import Polaroid from './ui/Polaroid';
import LoginCard from './LoginCard.jsx';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    const from = location.state?.from || '/home';

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
            style={{ background: palette.cream, fontFamily: "'Lora', Georgia, serif" }}
        >
            {/* Theme toggle */}
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="absolute top-4 right-4 z-20 p-2 transition-colors"
                style={{ color: palette.muted }}
                onMouseEnter={e => e.currentTarget.style.color = palette.brown}
                onMouseLeave={e => e.currentTarget.style.color = palette.muted}
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Paper line texture */}
            <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 27px, ${alpha('--echoes-amber', 0.08)} 28px)`,
                }}
            />

            {/* Glow blob */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 500, height: 500,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha('--echoes-amber', 0.09)} 0%, transparent 70%)`,
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* Scattered polaroids */}
            <Polaroid imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762101847784_Scan%202.11.2025%2C%2010.36.jpg?alt=media&token=edb8677e-f7e7-4db8-b27c-5d8983cb0600" rotate="-8deg"  label="Paris, 1963"     tint="#C9A87A" size="md" className="top-[10%] left-[4%]"    />
            <Polaroid imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762103986842_Jena_1960er.jpg?alt=media&token=05bd1ea6-a90e-4219-926a-8d1042d4514b" rotate="6deg"   label="Grandma & Joe"  tint="#A89070" size="md" className="top-[8%]  right-[5%]"   />
            <Polaroid imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762104605109_Goethe_Wohnhaus_Weimar_1966.jpg?alt=media&token=f96fc128-856b-4c94-b72b-5e1a519b581f" rotate="-4deg"  label="First car, 1971" tint="#9A8060" size="md" className="bottom-[12%] left-[3%]" />
            <Polaroid imageUrl="https://firebasestorage.googleapis.com/v0/b/echoes-prod-2afe6.firebasestorage.app/o/post_media%2FulTS5Y2Y6ab31Z5v0VNZibJnsRV2%2F1762106202384_Ga%CC%88nsema%CC%88nnchenbrunnen_Weimar_1966.jpg?alt=media&token=adee0f45-83b9-43aa-89eb-1c240aef8c51" rotate="9deg"   label="Brooklyn, 1952"   tint="#B8927A" size="md" className="bottom-[10%] right-[4%]"/>

            <LoginCard onSuccess={() => navigate(from, { replace: true })} />
        </div>
    );
}

export default Login;
