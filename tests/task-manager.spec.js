
const request = require('supertest')
const app = require('../index')
const Task = require('../models/task');
const Board = require('../models/board');
const Column = require('../models/column');



describe("Task Manager tests", () => {

  beforeEach(async () => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)

    const sprint = new Board({
      roomId: "default",
      id: "sprint1",
      columns: ["to-do", "in-progress", "in-revision", "done"],
      tasks: ["task1", "task2", "task3", "task4"],
      start: new Date(date),
      finish: new Date(date.setDate(date.getDate() + 14))
    })

    const backlog = new Board({
      roomId: "default",
      id: "backlog",
      columns: [],
      tasks: ["task5", "task6", "task7"],
    })

    const columns = [{
      id: "to-do",
      roomId: "default",
      boardId: "sprint1",
      name: "Por hacer",
      isInitial: true,
      isDone: false
    },{
      id: "in-progress",
      roomId: "default",
      boardId: "sprint1",
      name: "En progreso",
      isInitial: false,
      isDone: false
    },{
      id: "in-revision",
      roomId: "default",
      boardId: "sprint1",
      name: "En revisión",
      isInitial: false,
      isDone: false
    },{
      id: "done",
      roomId: "default",
      boardId: "sprint1",
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
    },{
      id: "task5",
      roomId: "default",
      title: "Task 5",
      status: "to-do"
    },{
      id: "task6",
      roomId: "default",
      title: "Task 6",
      status: "to-do"
    },{
      id: "task7",
      roomId: "default",
      title: "Task 7",
      status: "to-do"
    }]

    await Board.deleteMany()
    await Column.deleteMany()
    await Task.deleteMany()
  
    await sprint.save()
    await backlog.save()
    await Column.insertMany(columns)
    await Task.insertMany(tasks)
  })

  afterEach(() => {    
    jest.restoreAllMocks();
  });
  
  describe('Get boards method', () => {
    test('should return 200', async () => {
      await request(app)
        .get('/api/task-manager.boards')
        .query({ roomId: 'default' })
        .expect(200)
    })
  
    test('should return 500', async () => {
      jest.spyOn(Board, 'aggregate').mockRejectedValue("Error")

      await request(app)
        .get('/api/task-manager.boards')
        .query({ roomId: 'default' })
        .expect(500)
    })
  })

  describe('Edit column priority method', () => {
    test('should return 200', async () => {
      let board = await Board.findOne({ roomId: 'default', boardId: 'sprint1' })
      console.log("board!!!!!!!", board)
      expect(board.columns).toEqual(["to-do", "in-progress", "in-revision", "done"])

      await request(app)
        .put('/api/task-manager.column-priority')
        .query({ roomId: 'default', boardId: 'sprint1' })
        .send({ source: { columnId: 'to-do' }, destination: { index: 1 }})
        .expect(200)

      board = await Board.findOne({ roomId: 'default', boardId: 'sprint1' })
      expect(board.columns).toEqual(["in-progress", "to-do", "in-revision", "done"])
    })

    test('should return 400', async () => {
      jest.spyOn(Board, 'updateOne').mockResolvedValue({
        modifiedCount: 0
      })
  
      await request(app)
      .put('/api/task-manager.column-priority')
      .query({ roomId: 'default', boardId: 'sprint1' })
      .send({ source: { columnId: 'to-do' }, destination: { index: 1 }})
      .expect(400)
    })
  
    test('should return 500', async () => {
      jest.spyOn(Board, 'updateOne').mockRejectedValue("Error")
  
      await request(app)
        .put('/api/task-manager.column-priority')
        .query({ roomId: 'default', boardId: 'sprint1' })
        .send({ source: { columnId: 'to-do' }, destination: { index: 1 }})
        .expect(500)
    })
  })

  describe('Edit task priority method', () => {
    test('should return 200', async () => {
      let board = await Board.findOne({ roomId: 'default', boardId: 'backlog' })
      expect(board.tasks).toEqual(["task5", "task6", "task7"])

      await request(app)
        .put('/api/task-manager.task-priority')
        .query({ roomId: 'default', boardId: 'sprint1' })
        .send({
          source: { taskId: 'task2', boardId: "sprint1" },
          destination: { adjacentId: "task5", index: 0, columnId: "done", boardId: "backlog"}})
        .expect(200)

      board = await Board.findOne({ roomId: 'default', boardId: 'backlog' })
      expect(board.tasks).toEqual(["task2", "task5", "task6", "task7"])
    })

    test('should return 400', async () => {
      jest.spyOn(Board, 'updateOne').mockResolvedValue({
        modifiedCount: 0
      })
  
      await request(app)
        .put('/api/task-manager.task-priority')
        .query({ roomId: 'default', boardId: 'sprint1' })
        .send({
          source: { taskId: 'task2', boardId: "sprint1" },
          destination: { adjacentId: "task5", index: 0, columnId: "done", boardId: "backlog"}})
        .expect(400)
    })
  
    test('should return 500', async () => {
      jest.spyOn(Board, 'updateOne').mockRejectedValue("Error")
  
      await request(app)
        .put('/api/task-manager.task-priority')
        .query({ roomId: 'default', boardId: 'sprint1' })
        .send({
          source: { taskId: 'task2', boardId: "sprint1" },
          destination: { adjacentId: "task5", index: 0, columnId: "done", boardId: "backlog"}})
        .expect(500)
    })
  })
})
