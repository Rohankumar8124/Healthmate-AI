'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';

export default function Header() {
    const { user } = useUser();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#93c572] to-[#7ab356] flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-gray-800">
                        Medi<span className="text-[#93c572]">Care</span>
                    </span>
                </div>

                {/* Auth */}
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <button className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-[#93c572] text-white rounded-lg hover:bg-[#7ab356] border border-[#7ab356] transition-colors shadow-sm">
                                Get Started
                            </button>
                        </SignInButton>
                    </SignedOut>

                    <SignedIn>
                        <div className="flex items-center gap-3">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: 'w-9 h-9 ring-2 ring-[#93c572]/20',
                                        userButtonPopoverCard: 'border border-gray-200 shadow-lg rounded-xl',
                                        userButtonPopoverActionButton: 'hover:bg-[#eef5e9] rounded-lg',
                                    }
                                }}
                            />
                            <span className="hidden sm:inline text-sm text-gray-600">
                                Hi, <span className="text-[#93c572] font-semibold">{user?.firstName || 'there'}</span>
                            </span>
                        </div>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
