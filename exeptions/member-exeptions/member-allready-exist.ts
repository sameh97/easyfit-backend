export class MemberAllReadyExist extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}
