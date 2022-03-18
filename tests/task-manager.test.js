
const request = require('supertest')
const app = require('../index')
const Task = require('../models/task');
const Table = require('../models/table');
const Column = require('../models/column');



describe("Task Manager tests", () => {

  beforeEach(async () => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)

    const sprint = new Table({
      roomId: "default",
      id: "sprint1",
      columns: ["to-do", "in-progress", "in-revision", "done"],
      start: new Date(date),
      tasks: ["task1", "task2", "task3", "task4"],
      finish: new Date(date.setDate(date.getDate() + 14))
    })

    const backlog = new Table({
      roomId: "default",
      id: "backlog",
      columns: [],
      tasks: ["task5", "task6", "task7"],
    })

    const columns = [{
      id: "to-do",
      roomId: "default",
      tableId: "sprint1",
      name: "Por hacer",
      isInitial: true,
      isDone: false
    },{
      id: "in-progress",
      roomId: "default",
      tableId: "sprint1",
      name: "En progreso",
      isInitial: false,
      isDone: false
    },{
      id: "in-revision",
      roomId: "default",
      tableId: "sprint1",
      name: "En revisión",
      isInitial: false,
      isDone: false
    },{
      id: "done",
      roomId: "default",
      tableId: "sprint1",
      name: "Listo",
      isInitial: false,
      isDone: true
    }]

    const tasks = [{
      id: "task1",
      roomId: "default",
      title: "Task 1",
      status: "to-do"
    },{
      id: "task2",
      roomId: "default",
      title: "Task 2",
      status: "to-do"
    },{
      id: "task3",
      roomId: "default",
      title: "Task 3",
      status: "to-do"
    },{
      id: "task4",
      roomId: "default",
      title: "Task 4",
      status: "to-do"
    }]

    await Table.remove()
    await Column.remove()
    await Task.remove()
  
    await sprint.save()
    await backlog.save()
    await Column.insertMany(columns)
    await Task.insertMany(tasks)
  })  
  
  describe('Get boards method', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/api/task-manager.boards')
        .query({ roomId: 'default' })
        .expect(200)
    })
  
    test('should return 500', async () => {
      Table.aggregate = jest.fn().mockRejectedValueOnce("Error")
  
      await request(app)
        .get('/api/task-manager.boards')
        .query({ roomId: 'default' })
        .expect(500)
    })
  })
  
  describe('Get board method', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/api/task-manager.board')
        .query({ roomId: 'default' })
        .expect(200)
    })
  
    test('should return 500', async () => {
      Table.aggregate = jest.fn().mockRejectedValueOnce("Error")
  
      await request(app)
        .get('/api/task-manager.board')
        .query({ roomId: 'default' })
        .expect(500)
    })
  })
})
