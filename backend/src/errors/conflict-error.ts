export enum messageConflictError {
  product = 'Product With The Same Name Already Exists ',
  mail = 'Mail With The Same Name Already Exists ',
}

class ConflictError extends Error {
  public statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export default ConflictError;
