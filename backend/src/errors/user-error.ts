export enum messageBadUserRequest {
  auth = 'Incorrect Email Or Password',
  token = 'No Token',
  invalidToken = 'Invalid Token',
  noAuth = 'Authentication Error',
}

class BadUserRequestError extends Error {
  
  public statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export default BadUserRequestError;
