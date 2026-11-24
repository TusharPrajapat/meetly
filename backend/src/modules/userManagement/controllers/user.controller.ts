import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { EReturnCodes } from "../../common/enums/commonEnum.js";
import CommonUtils from "../../common/utils/commonUtils.js";

import UserService from "../services/user.service.js";

class UserController {

    // REGISTER USER
    public signUp = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                res.status(400).json({
                    dataResponse: CommonUtils.getDataResponse(
                        EReturnCodes.INVALID_DATA
                    ),
                    errors: validationErrors.array(),
                });

                return;
            }

            const response = await UserService.signUp(req);

            res.status(201).json(response);

        } catch (error) {
            console.error("Register user controller error:", error);

            res.status(500).json({
                dataResponse: CommonUtils.getDataResponse(
                    EReturnCodes.DB_ERROR
                ),
            });
        }
    };


    // LOGIN USER
    public login = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                res.status(400).json({
                    dataResponse: CommonUtils.getDataResponse(
                        EReturnCodes.INVALID_DATA
                    ),
                    errors: validationErrors.array(),
                });

                return;
            }

            const response = await UserService.login(req);

            res.status(200).json(response);

        } catch (error) {
            console.error("Login user controller error:", error);

            res.status(500).json({
                dataResponse: CommonUtils.getDataResponse(
                    EReturnCodes.DB_ERROR
                ),
            });
        }
    };


    // GET USER
    public getUser = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                res.status(400).json({
                    dataResponse: CommonUtils.getDataResponse(
                        EReturnCodes.INVALID_DATA
                    ),
                    errors: validationErrors.array(),
                });

                return;
            }

            const response = await UserService.getUser(req);

            res.status(200).json(response);

        } catch (error) {
            console.error("Get user controller error:", error);

            res.status(500).json({
                dataResponse: CommonUtils.getDataResponse(
                    EReturnCodes.DB_ERROR
                ),
            });
        }
    };

    //UPDATE USER
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                res.status(400).json({
                    dataResponse: CommonUtils.getDataResponse(EReturnCodes.INVALID_DATA),
                    errors: validationErrors.array(),
                });
                return;
            }

            const response = await UserService.updateUser(req);
            res.status(200).json(response);
        } catch (error) {
            console.error("Get user controller error:", error);
            res.status(500).json({
                dataResponse: CommonUtils.getDataResponse(EReturnCodes.DB_ERROR),
            });
        }
    };
}

export default new UserController();