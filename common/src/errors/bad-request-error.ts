import { AbstractCustomError } from "./abstract-custom-error";

class BadRequestError extends AbstractCustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}

export { BadRequestError };
