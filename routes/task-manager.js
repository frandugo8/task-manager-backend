
const express = require('express')
const taskManagerCtrl = require('../controllers/task-manager')
const router = express.Router()

router.get('/task-manager.boards', taskManagerCtrl.getBoards)

router.put('/task-manager.column-priority', taskManagerCtrl.editColumnPriority)
router.put('/task-manager.task-priority', taskManagerCtrl.editTaskPriority)

// router.delete('/tasks', taskManagerCtrl)
// router.delete('/sprints', taskManagerCtrl)

module.exports = router