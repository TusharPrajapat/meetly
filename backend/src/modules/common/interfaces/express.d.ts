import { IAuthorization } from "./requestInterface.js";

declare global {
    namespace Express {
        interface Request {
            auth_token?: IAuthorization;
        }
    }
}

export {};