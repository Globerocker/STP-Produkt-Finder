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
        <div className="flex items-center justify-center min-h-[50vh] animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-sm w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                            placeholder="Enter admin password"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm font-medium">Incorrect password</p>}
                    <button
                        type="submit"
                        className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors duration-300"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAuth;
