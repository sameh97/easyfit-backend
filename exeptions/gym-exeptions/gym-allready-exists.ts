export class GymAllReadyExist extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  
  