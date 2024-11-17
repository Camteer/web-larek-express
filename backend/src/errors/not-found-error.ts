export enum messageNotFoundError {
  page = 'Page Not Found',
  user = 'User Not Found',
}

class NotFound extends Error {
  
  public statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFound;
