import { AbstractCustomError } from "./abstract-custom-error";

class DatabaseConnectionError extends AbstractCustomError {
  statusCode = 500;

  constructor() {
    super("Error connecting to database");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serialize() {
    return [{ message: "Error connecting to database" }];
  }
}

export { DatabaseConnectionError };
