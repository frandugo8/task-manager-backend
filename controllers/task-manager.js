
const Table = require('../models/table');
const Column = require('../models/column');
const Task = require('../models/task');

const getBoards = async (req, res) => {
  try {
    const tables = await Table.aggregate([{
      $match: {roomId: req.query.roomId}
    },
    {
      $lookup: {
        from: "tasks",
        let: { id: "$roomId" },
        pipeline: [
          { $match: { "$expr": { "$eq": [ "$roomId", "$$id" ]}}},
          { $project: { "_id": 0, "id": 1, "title": 1, "status": 1 } }
        ],
        as: "tasks"
    }},
    {
      $project: {_id: 0, id: 1, tasks: 1, start: 1, finish: 1}
    }])

    return res.status(200).send(tables)
  } catch (err) {
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}

const getBoard = async (req, res) => {
  try {
    const table = await Table.aggregate([{
      $match: { roomId: req.query.roomId }
    },
    {
      $lookup: {
        from: "columns",
        let: { id: "$id" },
        pipeline: [
          { $match: { "$expr": { "$eq": [ "$tableId", "$$id" ]}}},
          { $project: { "_id": 0, "id": 1, "name": 1, "isInitial": 1, "isDone": 1} }
        ],
        as: "columns"
    }},
    {
      $project: {_id: 0, id: 1, columns: 1, start: 1, finish: 1}
    }])

    return res.status(200).send(table)
  } catch (err) {
    return res.status(500).send({ error: 'Internal Server Error' })
  }
}


module.exports = {
  getBoards,
  getBoard
}