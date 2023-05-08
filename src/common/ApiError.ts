import { LogCode } from 'src/enums';
import { ApiErrorResponse } from 'src/types';

export class ApiError extends Error {
  public readonly statusCode: number | undefined;

  public readonly response: object | undefined;

  public readonly message: string | undefined;

  public readonly type: string | undefined;

  public readonly name: string | undefined;

  // eslint-disable-next-line complexity
  constructor(data: ApiErrorResponse) {
    super();
    this.statusCode = data.statusCode || 500;
    this.message = data.message;
    this.type = data.type;
    this.name = data.name;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);

    this.response = data.response || {};
    switch (this.statusCode) {
      case 400:
        this.response = data.response || { code: LogCode.CODE_G002 };
        break;
      case 401:
        this.response = data.response || { code: LogCode.CODE_G002 };
        break;
      case 409:
        this.response = data.response || { code: LogCode.CODE_G004 };
        break;
      case 500:
        this.response = data.response || { code: LogCode.CODE_G001 };
        break;
      default:
        this.response = data.response || {};
    }
  }
}
