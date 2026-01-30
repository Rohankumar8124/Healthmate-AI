import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#93c572] to-[#7ab356] flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800">MediCare AI</h1>
                    </div>
                    <p className="text-gray-500">Create an account to get started</p>
                </div>
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: 'w-full',
                            card: 'shadow-md border border-gray-200 rounded-2xl',
                        }
                    }}
                />
            </div>
        </div>
    );
}
