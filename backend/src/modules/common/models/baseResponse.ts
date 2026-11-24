import { IResponse , IDataResponse} from "../interfaces/responseInterface";


class BaseResponse{
  public data?: any;
  public dataResponse!: IDataResponse;
  constructor(dataResponse: IDataResponse) {
    this.dataResponse = dataResponse;
  }
}

export default BaseResponse;
