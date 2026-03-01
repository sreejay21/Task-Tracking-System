const express = require('express');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes')
const teamRoutes = require('./team.routes')
const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);
//Task routes
router.use('/task', taskRoutes)
//Team/project routes
router.use('/team', teamRoutes)

module.exports = router;