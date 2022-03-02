
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  id: {
    type: String,
    
  },
  title: {
    type: String
    
  }
},
{
  versionKey: false
})

const Task = mongoose.model('Tasks', taskSchema)

module.exports = Task