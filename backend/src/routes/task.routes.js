const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/task.controller');

const router = express.Router();

// All task routes are protected
router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
