import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#111418] dark:text-slate-100 antialiased">
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-4">
                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10 h-full w-full bg-background-light dark:bg-background-dark bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]"></div>

                {/* Main Card Container */}
                <main className="w-full max-w-[480px] flex flex-col bg-white dark:bg-[#1e293b] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e5e7eb] dark:border-[#334155] overflow-hidden">
                    <div className="flex flex-col gap-6 p-8 sm:p-10">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                                <span className="material-symbols-outlined text-3xl">task_alt</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#111418] dark:text-white">Create an account</h1>
                            <p className="text-base text-[#617589] dark:text-slate-400">Start managing your tasks effectively today.</p>
                        </div>

                        {/* Error Message Area */}
                        {error && (
                            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                <span className="material-symbols-outlined text-[20px]">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Registration Form */}
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            {/* Full Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111418] dark:text-slate-200 text-sm font-medium leading-normal" htmlFor="full-name">Full Name</label>
                                <div className="relative">
                                    <input
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-[#475569] bg-white dark:bg-[#0f172a] focus:border-primary h-12 placeholder:text-[#617589] px-[15px] text-base font-normal leading-normal transition-all duration-200 ease-in-out"
                                        id="full-name"
                                        name="name"
                                        placeholder="e.g. John Doe"
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111418] dark:text-slate-200 text-sm font-medium leading-normal" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <input
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-[#475569] bg-white dark:bg-[#0f172a] focus:border-primary h-12 placeholder:text-[#617589] px-[15px] text-base font-normal leading-normal transition-all duration-200 ease-in-out"
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[#111418] dark:text-slate-200 text-sm font-medium leading-normal" htmlFor="password">Password</label>
                                <div className="relative">
                                    <input
                                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-[#475569] bg-white dark:bg-[#0f172a] focus:border-primary h-12 placeholder:text-[#617589] px-[15px] text-base font-normal leading-normal transition-all duration-200 ease-in-out"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-xs text-[#617589] dark:text-slate-500">Must be at least 8 characters long.</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="group relative mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                                    </svg>
                                ) : (
                                    <span className="truncate">Register</span>
                                )}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="flex items-center justify-center gap-1.5 text-sm text-[#111418] dark:text-slate-300">
                            <p>Already have an account?</p>
                            <Link className="font-bold text-primary hover:text-blue-600 hover:underline" to="/login">Log in</Link>
                        </div>
                    </div>

                    {/* Bottom decorative strip */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-primary to-blue-600"></div>
                </main>

                <footer className="mt-8 text-center text-xs text-[#617589] dark:text-slate-500">
                    © TaskMaster Inc. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Register;
