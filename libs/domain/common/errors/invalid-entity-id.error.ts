export class InvalidEntityIdError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, InvalidEntityIdError.prototype);
  }
}
