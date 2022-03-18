
const express = require('express')
const taskManagerCtrl = require('../controllers/task-manager')
const router = express.Router()

router.get('/task-manager.boards', taskManagerCtrl.getBoards)
router.get('/task-manager.board', taskManagerCtrl.getBoard)
// router.get('/sprints', taskManagerCtrl)

// router.post('/tasks.create', taskManagerCtrl)
// router.post('/sprints.create', taskManagerCtrl)

// router.put('/tasks', taskManagerCtrl)
// router.put('/sprint.column-priority', taskManagerCtrl.editColumnPriority)
// router.put('/sprint.task-priority', taskManagerCtrl.editTaskPriority)

// router.delete('/tasks', taskManagerCtrl)
// router.delete('/sprints', taskManagerCtrl)

module.exports = router