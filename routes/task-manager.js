
const express = require('express')
const taskManagerCtrl = require('../controllers/task-manager')
const router = express.Router()

router.get('/tasks', taskManagerCtrl.getTasks)
// router.get('/sprints', taskManagerCtrl)

// router.post('/tasks.create', taskManagerCtrl)
// router.post('/sprints.create', taskManagerCtrl)

// router.put('/tasks', taskManagerCtrl)

// router.delete('/tasks', taskManagerCtrl)
// router.delete('/sprints', taskManagerCtrl)

module.exports = router