const { getDb, saveDb } = require('../config/db');

const rowToTask = (columns, row) => {
    const task = {};
    columns.forEach((col, i) => {
        task[col] = row[i];
    });
    return task;
};

const Task = {
    create: (title, description, status, userId) => {
        const db = getDb();
        if (!db) return null;

        try {
            // Get the next ID
            let maxIdResult = db.exec('SELECT COALESCE(MAX(id), 0) as max_id FROM tasks');
            let nextId = 1;
            if (maxIdResult.length > 0 && maxIdResult[0].values.length > 0) {
                nextId = maxIdResult[0].values[0][0] + 1;
            }

            // Insert with explicit created_at
            const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
            const stmt = db.prepare('INSERT INTO tasks (title, description, status, user_id, created_at) VALUES (?, ?, ?, ?, ?)');
            stmt.run([title, description || null, status || 'pending', userId, now]);
            stmt.free();
            saveDb();

            // Return the newly created task
            const newTask = Task.findById(nextId);
            if (!newTask) {
                // Fallback: construct task manually
                return {
                    id: nextId,
                    title,
                    description: description || null,
                    status: status || 'pending',
                    created_at: now,
                    user_id: userId
                };
            }
            return newTask;
        } catch (err) {
            console.error('Task.create error:', err.message);
            return null;
        }
    },

    findAllByUserId: (userId) => {
        const db = getDb();
        if (!db) return [];

        try {
            const stmt = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC');
            stmt.bind([userId]);

            const tasks = [];
            while (stmt.step()) {
                const row = stmt.get();
                const columns = stmt.getColumnNames();
                tasks.push(rowToTask(columns, row));
            }
            stmt.free();
            return tasks;
        } catch (err) {
            console.error('Task.findAllByUserId error:', err.message);
            return [];
        }
    },

    findById: (id) => {
        const db = getDb();
        if (!db) return null;

        try {
            const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
            stmt.bind([id]);

            let task = null;
            if (stmt.step()) {
                const row = stmt.get();
                const columns = stmt.getColumnNames();
                task = rowToTask(columns, row);
            }
            stmt.free();
            return task;
        } catch (err) {
            console.error('Task.findById error:', err.message);
            return null;
        }
    },

    update: (id, fields) => {
        const db = getDb();
        if (!db) return null;

        const allowedFields = ['title', 'description', 'status'];
        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (fields[field] !== undefined) {
                updates.push(`${field} = ?`);
                values.push(fields[field]);
            }
        }

        if (updates.length === 0) {
            return Task.findById(id);
        }

        try {
            values.push(id);
            const stmt = db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`);
            stmt.run(values);
            stmt.free();
            saveDb();
            return Task.findById(id);
        } catch (err) {
            console.error('Task.update error:', err.message);
            return null;
        }
    },

    delete: (id) => {
        const db = getDb();
        if (!db) return { changes: 0 };

        try {
            const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
            stmt.run([id]);
            stmt.free();
            saveDb();
            return { changes: 1 };
        } catch (err) {
            console.error('Task.delete error:', err.message);
            return { changes: 0 };
        }
    }
};

module.exports = Task;
