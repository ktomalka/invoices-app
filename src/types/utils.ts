export interface ApiErrorResponse {
  statusCode: number;
  response: object;

  name?: string;
  type?: string;

  message?: string;
}
