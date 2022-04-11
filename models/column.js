
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const columnsSchema = new Schema({
  id: String,
  roomId: String,
  boardId: String,
  name: String,
  isInitial: Boolean,
  isDone: Boolean
},
{
  versionKey: false
}).index({
  roomId: 1,
  boardId: 1
})

const Column = mongoose.model('Columns', columnsSchema)

module.exports = Column