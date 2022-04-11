
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  id: {
    type: String,
    unique: true
  },
  roomId: String,
  title: {
    type: String,
    maxlength: 30,
    minlength: 1,
    required: true    
  },
  status: {
    type: String,
    enum: ["to-do", "in-progress", "in-revision", "done"],
    default: "to-do"
  }
},
{
  timestamps: true,
  versionKey: false
}).index({
  roomId: 1
})

const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task