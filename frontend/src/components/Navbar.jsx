import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-40 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-4 sm:px-10 py-3 shadow-sm">
            <div className="max-w-[960px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[24px]">check_circle</span>
                    </div>
                    <h1 className="text-text-main dark:text-white text-xl font-bold tracking-tight">Task Manager</h1>
                </div>
                <button
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg h-10 px-4 text-text-main dark:text-gray-200 text-sm font-bold transition-colors"
                    onClick={handleLogout}
                >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
