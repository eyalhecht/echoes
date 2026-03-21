import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';
import { palette, alpha } from '../styles/theme';
import LoginCard from './LoginCard.jsx';
import useUiStore from '../stores/useUiStore.js';

export default function AuthGateModal() {
    const { authGateOpen, authGateMessage, hideAuthGate } = useUiStore();

    return (
        <DialogPrimitive.Root open={authGateOpen} onOpenChange={(open) => { if (!open) hideAuthGate(); }}>
            <DialogPrimitive.Portal>
                {/* Overlay */}
                <DialogPrimitive.Overlay
                    className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
                    style={{ background: `${alpha('--echoes-amber', 0.08)} `, backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.6)' }}
                />

                {/* Content — transparent wrapper, just for positioning + close key handling */}
                <DialogPrimitive.Content
                    className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
                >
                    <VisuallyHidden.Root>
                    <DialogPrimitive.Title>Sign in to continue</DialogPrimitive.Title>
                    <DialogPrimitive.Description>{authGateMessage}</DialogPrimitive.Description>
                </VisuallyHidden.Root>

                {/* Close button — floating top-right of the card */}
                    <DialogPrimitive.Close
                        className="absolute top-2 right-6 z-10 p-1.5 transition-colors rounded-sm"
                        style={{ color: palette.muted }}
                        onMouseEnter={e => e.currentTarget.style.color = palette.brown}
                        onMouseLeave={e => e.currentTarget.style.color = palette.muted}
                    >
                        <X size={16} />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>

                    <LoginCard
                        subtitle={authGateMessage}
                        onSuccess={hideAuthGate}
                        showBackLink={false}
                        dark
                    />
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
