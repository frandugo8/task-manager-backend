
const Board = require('../models/board');
const Task = require('../models/task');
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');
const Column = require('../models/column');


const addSprint = async (req, res) => {
  const session = await Board.startSession()
  session.startTransaction();

  try {
    const lastSprint = await Board.findOne({roomId: req.body.roomId, id: {$ne: "backlog"}}, {}, {sort: {createdAt: -1}})
    const startDate = new Date(lastSprint.finish)
    const finishDate = new Date(lastSprint.finish)
    finishDate.setDate(finishDate.getDate() + 14)

    const sprintId = uuidv4()
    const columns = [{
      id: "to-do",
      roomId: req.body.roomId,
      boardId: sprintId,
      name: "Por hacer",
      isInitial: true,
      isDoen: false
    }, {
      id: "done",
      roomId: req.body.roomId,
      boardId: sprintId,
      name: "Listo",
      isInitial: false,
      isDone: true
    }]

    const sprint = new Board({
      roomId: req.body.roomId,
      id: sprintId,
      columns: [],
      tasks: [],
      start: startDate,
      finish: finishDate
    })

    await Column.insertMany(columns)
    await sprint.save()
    await session.commitTransaction()

    return res.status(200).send({sprintId})
  } catch (err) {
    console.log("err", err)
    await session.abortTransaction()
    await session.endSession()
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}

const addTask = async (req, res) => {
  const session = await Board.startSession()
  session.startTransaction();

  try {
    const taskId = uuidv4()
    const task = new Task({
      roomId: req.query.roomId,
      id: taskId,
      title: req.body.task,
      status: "to-do"
    })
    
    const update = await Board.updateOne({roomId: req.query.roomId, id: req.query.boardId}, {$push: {tasks: taskId}}, {session})
    await task.save({session})

    if (update.modifiedCount === 0) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(400).send({msg: "Invalid update"})
    } else {
      await session.commitTransaction()
    }
  
    return res.status(200).send({taskId})
  } catch (err) {
    console.log("err", err)
    await session.abortTransaction()
    await session.endSession()
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}

const getBoards = async (req, res) => {
  try {
    const boards = await Board.aggregate([{
      $match: {roomId: req.query.roomId}
    },
    {
      $lookup: {
        from: "tasks",
        let: { roomId: "$roomId", tasks: "$tasks" },
        pipeline: [
          { $match: { "$expr": { $and: [{"$eq": [ "$roomId", "$$roomId" ]}, {"$in": ["$id", "$$tasks"]}]}}},
          { $addFields: {"sort": { "$indexOfArray": [ "$$tasks", "$id" ]}}},
          { $sort: { "sort": 1 } },
          { $addFields: { "sort": "$$REMOVE" }},
          { $project: { "_id": 0, "id": 1, "title": 1, "status": 1 } }
        ],
        as: "tasks"
    }},
    {
      $lookup: {
        from: "columns",
        let: { roomId: "$roomId", columns: "$columns" },
        pipeline: [
          { $match: { "$expr": { $and: [{"$eq": [ "$roomId", "$$roomId" ]}, {"$in": [ "$id", "$$columns" ]}]}}},
          { $addFields: {"sort": { "$indexOfArray": [ "$$columns", "$id" ]}}},
          { $sort: { "sort": 1 } },
          { $addFields: { "sort": "$$REMOVE" }},
          { $project: { "_id": 0, "id": 1, "name": 1, "isInitial": 1, "isDone": 1 } }
        ],
        as: "columns"
    }},
    {
      $project: {_id: 0, id: 1, columns: 1, tasks: 1, start: 1, finish: 1}
    }])

    return res.status(200).send(boards)
  } catch (err) {
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}

const editColumnPriority = async (req, res) => {
  const [roomId, boardId, source, destination] = [req.query.roomId, req.query.boardId, req.body.source, req.body.destination]
  const session = await Board.startSession()
  session.startTransaction();

  try {
    const pull = await Board.updateOne({
      roomId,
      id: boardId
    }, {
      $pull: {"columns": source.columnId}
    }, { session })

    const push = await Board.updateOne({
      roomId,
      id: boardId
    }, {
      $push: {"columns": {$each: [source.columnId], $position: destination.index}}
    }, { session })

    if (pull.modifiedCount === 0 || push.modifiedCount === 0) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(400).send({msg: "Invalid update"})
    } else {
      await session.commitTransaction()
    }

    await session.endSession()

    return res.status(200).send({msg: "Column position updated successfully"})
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    console.log("err", err)
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}

const editTaskPriority = async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction();

  const [roomId, boardId, source, destination] = [req.query.roomId, req.query.boardId, req.body.source,
    req.body.destination]

  try {
    const adjacentIndex = await Board.aggregate([
      { $match: {roomId, id: destination.boardId} },
      { $project: { "result": {$indexOfArray: [ "$tasks", destination.adjacentId]}}}
    ])

    const pull = await Board.updateOne({
      roomId,
      id: source.boardId
    }, {
      $pull: {"tasks": source.taskId}
    }, { session })

    const push = await Board.updateOne({
      roomId,
      id: destination.boardId
    }, {
      $push: {"tasks": {
        $each: [source.taskId],
        $position: boardId === undefined || destination.adjacentId === undefined? destination.index : adjacentIndex[0].result
      }}
    }, { session })

    const task = await Task.updateOne({
      roomId,
      id: source.taskId
    }, {
      $set: {
        status: destination.columnId
      }
    }, { session })

    if (pull.modifiedCount === 0 || push.modifiedCount === 0 || task.modifiedCount === 0) {
      await session.abortTransaction()
      await session.endSession()
      return res.status(400).send({msg: "Invalid update"})
    } else {
      await session.commitTransaction()
    }

    await session.endSession()

    return res.status(200).send({msg: "Task position updated successfully"})
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    console.log("err", err)
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}

module.exports = {
  addSprint,
  addTask,
  getBoards,
  editColumnPriority,
  editTaskPriority
}