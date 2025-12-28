const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass = 'bg-red-600 hover:bg-red-500',
    isLoading = false,
    icon = 'warning',
    iconClass = 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
}) => {
    if (!isOpen) return null;

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity"></div>

            {/* Modal Container */}
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-border-light dark:border-border-dark">
                        {/* Content */}
                        <div className="px-5 pb-5 pt-6">
                            <div className="sm:flex sm:items-start gap-4">
                                {/* Icon */}
                                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconClass}`}>
                                    <span className="material-symbols-outlined text-[24px]">{icon}</span>
                                </div>

                                {/* Text */}
                                <div className="mt-3 text-center sm:ml-2 sm:mt-0 sm:text-left">
                                    <h3 className="text-lg font-bold leading-6 text-text-main dark:text-white" id="modal-title">
                                        {title}
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
                                            {message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-gray-50 dark:bg-background-dark/50 px-5 py-4 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-border-light dark:border-border-dark">
                            <button
                                className={`inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-sm sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${confirmButtonClass}`}
                                type="button"
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : confirmText}
                            </button>
                            <button
                                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-transparent px-4 py-2.5 text-sm font-bold text-text-main dark:text-gray-300 shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 sm:mt-0 sm:w-auto transition-colors"
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
