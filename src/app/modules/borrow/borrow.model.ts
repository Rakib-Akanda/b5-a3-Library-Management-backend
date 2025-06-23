import { model, Schema } from "mongoose";
import { IBorrow, IBorrowModel } from "./borrow.interface";
import Book from "../books/book.model";
import { CustomError } from "../../../utils/customError";

const borrowSchema = new Schema<IBorrow, IBorrowModel>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Books",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "At least 1 book"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

borrowSchema.static(
  "borrowBook",
  async function borrowBook(borrowBody: IBorrow) {
    const { book: bookId, quantity, dueDate } = borrowBody;
    //   console.log(bookId, quantity, dueDate);
    const book = await Book.findOneAndUpdate(
      {
        _id: bookId,
        copies: { $gte: quantity },
      },
      [
        {
          $set: {
            copies: { $subtract: ["$copies", quantity] },
          },
        },
        {
          $set: {
            available: { $gt: ["$copies", 0] },
          },
        },
      ],
      {
        new: true,
        runValidators: true,
      },
    );
    if (!book) throw new CustomError(404, "Not enough copies available");
    if (book.copies === 0) book.available = false;
    const borrow = await Borrow.create({
      book: bookId,
      quantity,
      dueDate,
    });
    return borrow;
  },
);

const Borrow = model<IBorrow, IBorrowModel>("Borrow", borrowSchema);
export default Borrow;
