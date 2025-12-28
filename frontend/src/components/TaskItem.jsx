const TaskItem = ({ task, onStatusChange, onDelete, formatDate }) => {
    const isDone = task.status === 'done';

    const getStatusBadgeClasses = (status) => {
        switch (status) {
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'done':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'in_progress':
                return 'In Progress';
            case 'done':
                return 'Done';
            default:
                return 'Pending';
        }
    };

    return (
        <article className={`group bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 items-start sm:items-center ${isDone ? 'opacity-75 hover:opacity-100' : ''}`}>
            <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-base font-bold text-text-main dark:text-white leading-tight ${isDone ? 'line-through text-text-secondary' : ''}`}>
                        {task.title}
                    </h3>
                    <span className={`sm:hidden inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(task.status)}`}>
                        {getStatusLabel(task.status)}
                    </span>
                </div>
                {task.description && (
                    <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed mb-3">{task.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-text-secondary dark:text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {formatDate(task.created_at)}
                    </span>
                    <span className="hidden sm:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${getStatusBadgeClasses(task.status)}`}>
                        {getStatusLabel(task.status)}
                    </span>
                </div>
            </div>
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-border-light dark:border-border-dark pt-4 sm:pt-0 mt-2 sm:mt-0">
                <div className="relative min-w-[140px]">
                    <select
                        className="w-full h-9 pl-3 pr-8 text-sm bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer font-medium"
                        style={{
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            backgroundImage: 'none'
                        }}
                        value={task.status}
                        onChange={(e) => onStatusChange(task.id, e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                        <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </span>
                </div>
                <button
                    className="size-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete Task"
                    onClick={() => onDelete(task)}
                >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
            </div>
        </article>
    );
};

export default TaskItem;
