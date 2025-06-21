import { Model, Types } from "mongoose";

export interface IBorrow {
  book: Types.ObjectId | "string";
  quantity: number;
  dueDate: Date;
}

// static methods
export interface IBorrowModel extends Model<IBorrow, {}> {
  borrowBook(borrowBody: IBorrow): Promise<any>;
}
