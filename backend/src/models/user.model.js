const { getDb, saveDb } = require('../config/db');

const User = {
    create: (name, email, hashedPassword) => {
        const db = getDb();
        if (!db) return null;

        try {
            // Get the next ID
            let maxIdResult = db.exec('SELECT COALESCE(MAX(id), 0) as max_id FROM users');
            let nextId = 1;
            if (maxIdResult.length > 0 && maxIdResult[0].values.length > 0) {
                nextId = maxIdResult[0].values[0][0] + 1;
            }

            const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
            stmt.run([name, email, hashedPassword]);
            stmt.free();
            saveDb();

            return { id: nextId, name, email };
        } catch (err) {
            console.error('User.create error:', err.message);
            return null;
        }
    },

    findByEmail: (email) => {
        const db = getDb();
        if (!db) return null;

        try {
            const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
            stmt.bind([email]);

            let user = null;
            if (stmt.step()) {
                const row = stmt.get();
                const columns = stmt.getColumnNames();
                user = {};
                columns.forEach((col, i) => {
                    user[col] = row[i];
                });
            }
            stmt.free();
            return user;
        } catch (err) {
            console.error('User.findByEmail error:', err.message);
            return null;
        }
    },

    findById: (id) => {
        const db = getDb();
        if (!db) return null;

        try {
            const stmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
            stmt.bind([id]);

            let user = null;
            if (stmt.step()) {
                const row = stmt.get();
                const columns = stmt.getColumnNames();
                user = {};
                columns.forEach((col, i) => {
                    user[col] = row[i];
                });
            }
            stmt.free();
            return user;
        } catch (err) {
            console.error('User.findById error:', err.message);
            return null;
        }
    }
};

module.exports = User;
