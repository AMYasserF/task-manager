import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-[#111418] dark:text-white antialiased min-h-screen flex flex-col items-center justify-center p-4">
            {/* Central Card Container */}
            <div className="w-full max-w-[420px] bg-white dark:bg-[#1A2633] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3b4d] overflow-hidden">
                <div className="p-8 md:p-10 flex flex-col gap-8">
                    {/* Header Section */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        {/* Logo Icon */}
                        <div className="size-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
                            <span className="material-symbols-outlined text-[32px]">task_alt</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-[#111418] dark:text-white tracking-tight text-[28px] font-bold leading-tight">Welcome back</h1>
                            <p className="text-[#617589] dark:text-[#94a3b8] text-sm font-normal leading-normal">
                                Sign in to your Task Manager account
                            </p>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#111418] dark:text-[#e2e8f0] text-sm font-medium leading-normal" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="form-input flex w-full h-12 px-4 rounded-lg bg-white dark:bg-[#111923] border border-[#dbe0e6] dark:border-[#334155] text-[#111418] dark:text-white placeholder-[#617589] dark:placeholder-[#64748b] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-normal"
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-[#111418] dark:text-[#e2e8f0] text-sm font-medium leading-normal" htmlFor="password">
                                    Password
                                </label>
                            </div>
                            <div className="relative flex w-full items-stretch rounded-lg">
                                <input
                                    className="form-input flex w-full h-12 px-4 pr-12 rounded-lg bg-white dark:bg-[#111923] border border-[#dbe0e6] dark:border-[#334155] text-[#111418] dark:text-white placeholder-[#617589] dark:placeholder-[#64748b] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base font-normal"
                                    id="password"
                                    placeholder="••••••••"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                                <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                                    <button
                                        className="text-[#617589] dark:text-[#64748b] hover:text-primary dark:hover:text-primary transition-colors p-1 rounded-md"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-[20px] leading-none">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error Message Area */}
                        {error && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">error</span>
                                <p className="text-red-600 dark:text-red-400 text-sm font-medium leading-normal">{error}</p>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            className="relative flex w-full items-center justify-center gap-2 h-12 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-[#1A2633] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="material-symbols-outlined spinner text-[20px]">progress_activity</span>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="flex flex-col items-center gap-4 pt-2 border-t border-[#f0f2f4] dark:border-[#2a3b4d]">
                        <p className="text-[#617589] dark:text-[#94a3b8] text-sm font-normal">
                            Don't have an account?{' '}
                            <Link className="text-primary font-medium hover:underline decoration-primary/50 underline-offset-4" to="/register">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
