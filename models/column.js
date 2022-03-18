
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const columnsSchema = new Schema({
  id: {
    type: String,
    unique: true
  },
  roomId: String,
  tableId: String,
  name: String,
  isInitial: Boolean,
  isDone: Boolean
},
{
  versionKey: false
}).index({
  roomId: 1,
  tableId: 1
})

const Column = mongoose.model('Columns', columnsSchema)

module.exports = Column