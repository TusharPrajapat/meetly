import { EReturnCodes } from "../enums/commonEnum.js";
import { IDataResponse } from "../interfaces/responseInterface.js";

class CommonUtils {
    static getDataResponse = (returnCode: EReturnCodes): IDataResponse => {
        const response: IDataResponse = {
            returnCode,
            responseDateTime: new Date(),
            description: "No data found",
        };

        switch (returnCode) {
            case EReturnCodes.SUCCESS:
                response.description = "Success";
                break;

            case EReturnCodes.NOT_FOUND:
                response.description = "Data not found";
                break;

            case EReturnCodes.AUTHENTICATION_FAILED:
                response.description = "Authentication failed";
                break;

            case EReturnCodes.DB_ERROR:
                response.description = "Database error";
                break;

            case EReturnCodes.DUPLICATE_DATA:
                response.description = "Duplicate data";
                break;

            case EReturnCodes.UNAUTHORIZED:
                response.description = "Unauthorized";
                break;

            case EReturnCodes.CREATED:
                response.description = "Created successfully";
                break;

            case EReturnCodes.INVALID_DATA:
                response.description = "Invalid data";
                break;

            case EReturnCodes.INVALID_REQUEST:
                response.description = "Invalid request";
                break;

            default:
                response.description = "Unknown response";
                break;
        }

        return response;
    };
}

export default CommonUtils;