import { useState } from 'react';

const TaskForm = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        // Parent handles the async logic and closes the modal
        onSubmit(title.trim(), description.trim());
    };

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-900/50 transition-opacity"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-border-light dark:border-border-dark">
                        <div className="px-5 pb-5 pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-text-main dark:text-white" id="modal-title">Create New Task</h3>
                                <button
                                    className="text-text-secondary hover:text-text-main dark:hover:text-white transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={onClose}
                                >
                                    <span className="material-symbols-outlined text-[24px]">close</span>
                                </button>
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400 mb-5">
                                    <span className="material-symbols-outlined text-[20px]">error</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-text-main dark:text-gray-300">Title</label>
                                    <input
                                        className="w-full h-11 px-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-text-main dark:text-white placeholder-text-secondary focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                        placeholder="e.g., Implement login API"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-text-main dark:text-gray-300">Description</label>
                                    <textarea
                                        className="w-full min-h-[120px] p-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-text-main dark:text-white placeholder-text-secondary focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-y"
                                        placeholder="Enter task details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-background-dark/50 px-5 py-4 sm:flex sm:flex-row-reverse sm:px-6 gap-3 border-t border-border-light dark:border-border-dark">
                            <button
                                className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover sm:w-auto"
                                type="button"
                                onClick={handleSubmit}
                            >
                                Add Task
                            </button>
                            <button
                                className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-transparent px-4 py-2.5 text-sm font-bold text-text-main dark:text-gray-300 shadow-sm ring-1 ring-inset ring-border-light dark:ring-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 sm:mt-0 sm:w-auto"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskForm;
