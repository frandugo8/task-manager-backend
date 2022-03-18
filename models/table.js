
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tableSchema = new Schema({
  roomId: String,
  id: String,
  columns: [String],
  tasks: [String],
  start: {
    type: Date,
    default: undefined
  },
  finish: {
    type: Date,
    default: undefined
  },
  isBacklog: Boolean
},
{
  timestamps: true,
  versionKey: false
}).index({
  roomId: 1,
  id: 1
})

const Table = mongoose.model('Tables', tableSchema)

module.exports = Table