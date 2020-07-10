import { ValidationError } from "express-validator";
import { AbstractCustomError } from "./abstract-custom-error";

class RequestValidationError extends AbstractCustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Error validating request");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}

export { RequestValidationError };
