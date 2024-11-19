export enum messageBadRequest {
  data = 'Incorrect data',
  product = 'Product Not Found',
  price = 'Incorrect Price',
  total = 'Incorrect Total Price',
  token = 'No Token',
}

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export default BadRequestError;
