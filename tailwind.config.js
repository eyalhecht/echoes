/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			tight: '2px',
  			generous: '16px',
  		},
  		boxShadow: {
  			paper:  '0 1px 2px hsl(16 55% 14% / 0.06), 0 3px 12px hsl(16 55% 14% / 0.05)',
  			lifted: '0 2px 8px hsl(16 55% 14% / 0.10), 0 8px 24px hsl(16 55% 14% / 0.08)',
  			float:  '0 8px 24px hsl(16 55% 14% / 0.16), 0 20px 48px hsl(16 55% 14% / 0.12)',
  		},
  		animation: {
  			'fade-in-up':    'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'fade-in-down':  'fadeInDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'slide-in-left': 'slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'slide-in-right':'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'bounce-in':     'bounceIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'scale-in':      'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  			'pulse-glow':    'pulseGlow 2s ease-in-out infinite',
  		},
  		keyframes: {
  			fadeInUp: {
  				'0%':   { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			fadeInDown: {
  				'0%':   { opacity: '0', transform: 'translateY(-20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			slideInLeft: {
  				'0%':   { opacity: '0', transform: 'translateX(-30px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' }
  			},
  			slideInRight: {
  				'0%':   { opacity: '0', transform: 'translateX(30px)' },
  				'100%': { opacity: '1', transform: 'translateX(0)' }
  			},
  			bounceIn: {
  				'0%':   { opacity: '0', transform: 'scale(0.9)' },
  				'60%':  { opacity: '1', transform: 'scale(1.02)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			scaleIn: {
  				'0%':   { opacity: '0', transform: 'scale(0.95)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			pulseGlow: {
  				'0%, 100%': { opacity: '1', transform: 'scale(1)' },
  				'50%':      { opacity: '0.8', transform: 'scale(1.02)' }
  			}
  		},
  		animationDelay: {
  			'100':  '100ms',
  			'200':  '200ms',
  			'300':  '300ms',
  			'500':  '500ms',
  			'700':  '700ms',
  			'1000': '1000ms'
  		},
  		colors: {
  			echoes: {
  				cream:     'hsl(var(--echoes-cream))',
  				parchment: 'hsl(var(--echoes-parchment))',
  				brown:     'hsl(var(--echoes-brown))',
  				amber:     'hsl(var(--echoes-amber))',
  				teal:      'hsl(var(--echoes-teal))',
  				sage:      'hsl(var(--echoes-sage))',
  				muted:     'hsl(var(--echoes-muted))',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT:    'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT:    'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT:    'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT:    'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT:    'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT:    'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT:    'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input:  'hsl(var(--input))',
  			ring:   'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT:              'hsl(var(--sidebar-background))',
  				foreground:           'hsl(var(--sidebar-foreground))',
  				primary:              'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent:               'hsl(var(--sidebar-accent))',
  				'accent-foreground':  'hsl(var(--sidebar-accent-foreground))',
  				border:               'hsl(var(--sidebar-border))',
  				ring:                 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
