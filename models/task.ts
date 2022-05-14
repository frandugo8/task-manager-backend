
import mongoose, { Schema, model } from 'mongoose';

export interface Task extends mongoose.Document {
  id: string
  roomId: string
  title: string
  status: "to-do" | "in-progress" | "in-revision" |  "done"
};

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

export default model<Task>('Tasks', taskSchema)