import { AbstractCustomError } from "./abstract-custom-error";

class NotAuthorizedError extends AbstractCustomError {
  statusCode = 401;

  constructor() {
    super("Not Authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serialize(): { message: string; field?: string }[] {
    return [
      {
        message: "Not Authorized",
      },
    ];
  }
}

export { NotAuthorizedError };
