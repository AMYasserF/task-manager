import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const tasksPerPage = 10;

    const fetchTasks = async (page = 1) => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get(`/tasks?page=${page}&limit=${tasksPerPage}`);
            setTasks(response.data.tasks || response.data);
            setPagination(response.data.pagination || null);
            setCurrentPage(page);
        } catch (err) {
            setError('Failed to sync tasks. Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        fetchTasks(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async (title, description) => {
        setShowModal(false);

        try {
            await api.post('/tasks', { title, description });
            fetchTasks(1);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task. Please try again.');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        if (!id || id === undefined || id === null) {
            setError('Cannot update task: Invalid task ID');
            return;
        }

        const previousTasks = [...tasks];
        setTasks(prevTasks => prevTasks.map(task =>
            task && task.id === id ? { ...task, status } : task
        ).filter(Boolean));

        try {
            await api.put(`/tasks/${id}`, { status });
        } catch (err) {
            setTasks(previousTasks);
            setError(err.response?.data?.message || 'Failed to update task status.');
        }
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;

        if (!taskToDelete.id || taskToDelete.id === undefined || taskToDelete.id === null) {
            setError('Cannot delete task: Invalid task ID');
            setShowDeleteModal(false);
            setTaskToDelete(null);
            return;
        }

        setShowDeleteModal(false);
        setTaskToDelete(null);

        try {
            await api.delete(`/tasks/${taskToDelete.id}`);
            const tasksOnCurrentPage = tasks.length;
            if (tasksOnCurrentPage === 1 && currentPage > 1) {
                fetchTasks(currentPage - 1);
            } else {
                fetchTasks(currentPage);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-white min-h-screen flex flex-col font-display transition-colors duration-200">
            <Navbar />

            <main className="flex-1 w-full max-w-[960px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
                <ErrorMessage message={error} onClose={() => setError('')} />

                <section className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-text-main dark:text-white">Your Tasks</h2>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-text-secondary dark:text-gray-400 font-medium hidden sm:block">
                                {pagination ? `${pagination.total} ${pagination.total === 1 ? 'task' : 'tasks'}` : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}
                            </div>
                            <button
                                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white h-10 px-4 rounded-lg font-bold text-sm transition-colors shadow-sm"
                                onClick={() => setShowModal(true)}
                            >
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                <span>New Task</span>
                            </button>
                        </div>
                    </div>

                    {loading && <LoadingSpinner size="medium" message="Loading tasks..." />}

                    {!loading && tasks.length === 0 && (
                        <EmptyState
                            icon="task"
                            title="No tasks yet"
                            message="Create your first task to get started."
                            actionLabel="Create Task"
                            onAction={() => setShowModal(true)}
                        />
                    )}

                    {!loading && tasks.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {tasks.filter(Boolean).map(task => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onStatusChange={handleUpdateStatus}
                                    onDelete={handleDeleteClick}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && pagination && pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                            hasMore={pagination.hasMore}
                        />
                    )}
                </section>
            </main>

            {showModal && (
                <TaskForm
                    onClose={() => setShowModal(false)}
                    onSubmit={handleCreateTask}
                />
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setTaskToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmButtonClass="bg-red-600 hover:bg-red-500"
                isLoading={deleting}
                icon="warning"
                iconClass="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            />

            <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-50 bg-gradient-to-b from-white to-transparent dark:from-[#1A2633] dark:to-background-dark h-[300px]"></div>
        </div>
    );
};

export default Dashboard;
