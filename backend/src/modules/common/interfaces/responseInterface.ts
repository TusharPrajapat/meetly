import { EReturnCodes } from "../enums/commonEnum";

export interface IDataResponse {
  returnCode: EReturnCodes;
  responseDateTime: Date;
  description: string;
}

export interface IResponse<T> {
  data?: T;
  dataResponse: IDataResponse;
}