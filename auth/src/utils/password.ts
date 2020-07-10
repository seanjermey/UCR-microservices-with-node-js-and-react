import { createHash } from "crypto";

const ALGORITHM = "sha512";
const ENCODING = "hex";

class Password {
  /**
   *
   * @param password
   */
  static async toHash(password: string) {
    return createHash(ALGORITHM).update(password).digest(ENCODING);
  }

  /**
   *
   * @param hashedPassword
   * @param password
   */
  static async compare(hashedPassword: string, password: string) {
    return (
      createHash(ALGORITHM).update(password).digest(ENCODING) === hashedPassword
    );
  }
}

export { Password };
