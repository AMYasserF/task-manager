const Pagination = ({ currentPage, totalPages, onPageChange, hasMore }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border-light dark:border-border-dark text-text-main dark:text-white hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {getPageNumbers().map((page, index) => (
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-text-secondary">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`h-9 min-w-[36px] px-3 rounded-lg font-medium text-sm transition-colors ${currentPage === page
                                ? 'bg-primary text-white'
                                : 'border border-border-light dark:border-border-dark text-text-main dark:text-white hover:bg-surface-light dark:hover:bg-surface-dark'
                            }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasMore}
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-border-light dark:border-border-dark text-text-main dark:text-white hover:bg-surface-light dark:hover:bg-surface-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
        </div>
    );
};

export default Pagination;
