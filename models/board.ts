import mongoose, { Schema, model } from 'mongoose';

export interface Board extends mongoose.Document {
  roomId: string,
  id: string,
  columns: Array<string>,
  tasks: Array<string>,
  start: Date,
  finish: Date,
  isBacklog: boolean
};

const boardSchema = new Schema({
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
  id: 1,
  createdAt: -1
})

export default model<Board>('Boards', boardSchema)