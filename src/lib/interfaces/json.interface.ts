export interface Json<T> {
  statusCode: number;
  message: string;
  result?: T;
}
