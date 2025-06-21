export class CustomError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public payload?: any
  ) {
    super(message);
  }
}
