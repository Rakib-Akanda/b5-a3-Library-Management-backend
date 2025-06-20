import { Error as MongooseError } from "mongoose";

const handleValidationError = (err: MongooseError.ValidationError) => {
  const simplifiedErrors: Record<string, any> = {};
  for (const key in err.errors) {
    const fieldError = err.errors[key];
    simplifiedErrors[key] = {
      message: fieldError.message,
      name: fieldError.name,
      properties: (fieldError as any).properties,
      kind: (fieldError as any).kind,
      path: (fieldError as any).path,
      value: (fieldError as any).value,
    };
  }
  return {
    message: "Validation failed",
    success: false,
    error: {
      name: "ValidationError",
      error: simplifiedErrors,
    },
  };
};

export default handleValidationError;
