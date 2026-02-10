import React, { useState, useEffect } from 'react';

interface AdminAuthProps {
    children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem('stp_admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side check. In production, this should be server-side or at least encrypted.
        if (password === 'stp-admin-2026') {
            localStorage.setItem('stp_admin_auth', 'true');
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('stp_admin_auth');
        setIsAuthenticated(false);
    };

    if (isAuthenticated) {
        return (
            <div className="relative">
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-4 text-xs text-gray-400 hover:text-red-500 underline"
                >
                    Logout
                </button>
                {children}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] animate-fade-in relative z-10">
            <div className="bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-premium border border-white/60 max-w-sm w-full">
                <h2 className="text-3xl font-bold text-brand-primary mb-2 text-center">Admin Access</h2>
                <p className="text-gray-500 text-center mb-8 text-sm">Please enter the secure password to view the dashboard.</p>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none transition-all text-center tracking-widest"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm font-medium text-center animate-shake">Incorrect password</p>}
                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;
