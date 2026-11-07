export class BusinessRuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
