const Task = require('../models/task.model');

const createTask = (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.userId;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const validStatuses = ['pending', 'in_progress', 'done'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const task = Task.create(title, description, status, userId);

        if (!task) {
            return res.status(500).json({ message: 'Failed to create task' });
        }

        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTasks = (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const allTasks = Task.findAllByUserId(userId);
        const total = allTasks.length;
        const tasks = allTasks.slice(offset, offset + limit);

        res.status(200).json({
            tasks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: offset + limit < total
            }
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const updateTask = (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { title, description, status } = req.body;
        const userId = req.userId;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user_id !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const validStatuses = ['pending', 'in_progress', 'done'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedTask = Task.update(id, { title, description, status });
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTask = (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const userId = req.userId;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user_id !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        Task.delete(id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
