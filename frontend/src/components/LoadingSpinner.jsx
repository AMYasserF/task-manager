const LoadingSpinner = ({ size = 'medium', message = '' }) => {
    const sizeClasses = {
        small: 'text-[24px]',
        medium: 'text-[48px]',
        large: 'text-[64px]'
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
            <span className={`material-symbols-outlined spinner text-primary ${sizeClasses[size]}`}>
                progress_activity
            </span>
            {message && (
                <p className="text-text-secondary dark:text-gray-400 text-sm font-medium">
                    {message}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
