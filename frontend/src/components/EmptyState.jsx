const EmptyState = ({
    icon = 'task',
    title,
    message,
    actionLabel,
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-text-secondary text-[64px] mb-4">
                {icon}
            </span>
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-text-secondary dark:text-gray-400 text-sm mb-4">
                {message}
            </p>
            {actionLabel && onAction && (
                <button
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white h-10 px-4 rounded-lg font-bold text-sm transition-colors"
                    onClick={onAction}
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>{actionLabel}</span>
                </button>
            )}
        </div>
    );
};

export default EmptyState;
