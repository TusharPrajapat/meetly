import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import CommonUtils from "../modules/common/utils/commonUtils";
import { EReturnCodes } from "../modules/common/enums/commonEnum";
import { IAuthorization } from "../modules/common/interfaces/requestInterface";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {

    try {
        const authHeader = req.headers.authorization;

        // Check authorization header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                dataResponse: CommonUtils.getDataResponse(EReturnCodes.AUTHENTICATION_FAILED),
            });

            return;
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                dataResponse: CommonUtils.getDataResponse(
                    EReturnCodes.AUTHENTICATION_FAILED
                ),
            });

            return;
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not configured");
        }

        // Verify token
        const decoded = jwt.verify(token, jwtSecret);

        const auth_token : IAuthorization = {
            userId: decoded?.userId,
            fullName: decoded?.name
        }

        // Attach auth token to request
        req.auth_token = auth_token;

        next();
    } catch (error) {
        res.status(401).send("Invalid jwt Token");
        return;
    }
};