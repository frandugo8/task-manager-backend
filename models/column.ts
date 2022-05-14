
import mongoose, { Schema, model } from 'mongoose';

export interface Column extends mongoose.Document {
  id: string,
  roomId: string,
  boardId: string,
  name: string,
  isInitial: boolean,
  isDone: boolean
};

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

export default model<Column>('Columns', columnsSchema)