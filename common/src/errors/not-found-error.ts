import { AbstractCustomError } from "./abstract-custom-error";

class NotFoundError extends AbstractCustomError {
  statusCode = 404;

  constructor() {
    super("Route not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize() {
    return [{ message: "Not found" }];
  }
}

export { NotFoundError };
