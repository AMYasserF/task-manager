const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 mt-0.5">error</span>
            <div className="flex-1">
                <h3 className="text-red-800 dark:text-red-300 text-sm font-bold">Error</h3>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{message}</p>
            </div>
            {onClose && (
                <button
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                    onClick={onClose}
                    aria-label="Close error message"
                >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
