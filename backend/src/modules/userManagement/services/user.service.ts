import { Request } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { EReturnCodes } from "../../common/enums/commonEnum.js";
import CommonUtils from "../../common/utils/commonUtils.js";

import {
    UserMaster,
    UserMasterDTO,
} from "../models/userMaster.model.js";
import { Op, WhereOptions } from "sequelize";

class UserService{
    // REGISTER USER
    public async signUp (req: Request): Promise<UserMasterDTO> {

        const resDTO = new UserMasterDTO(
            CommonUtils.getDataResponse(EReturnCodes.DB_ERROR)
        );

        try {
            const { name, email, password } = req.body;

            // Normalize email
            const normalizedEmail = email.trim().toLowerCase();

            // Check whether user already exists
            const existingUser = await UserMaster.findOne({
                where: {
                    email: normalizedEmail,
                    isDeleted: 0,
                },
            });

            if (existingUser) {
                resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.DUPLICATE_DATA);
                return resDTO;
            }

            // Hash password
            const saltRounds = Number(process.env.SALT_ROUNDS);

            const passwordHash = await bcrypt.hash(
                password,
                saltRounds
            );

            // Create user
            const newUser = await UserMaster.create({
                name: name.trim(),
                email: normalizedEmail,
                passwordHash,
            });

            // Prepare safe response data
            const userData = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                emailVerifiedOn: newUser.emailVerifiedOn,
                isActive: newUser.isActive,
                createdOn: newUser.createdOn,
            };

            resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.CREATED);
            resDTO.data = userData;
            return resDTO;

        } catch (error) {
            console.error("Register user service error:", error);
            return resDTO;
        }
    };


    // LOGIN USER
    public async login (req: Request): Promise<UserMasterDTO> {

        const resDTO = new UserMasterDTO(
            CommonUtils.getDataResponse(EReturnCodes.DB_ERROR)
        );

        try {
            const { email, password } = req.body;

            // Normalize email
            const normalizedEmail = email.trim().toLowerCase();

            // Find user
            const user = await UserMaster.findOne({
                where: {
                    email: normalizedEmail,
                    isDeleted: 0,
                },
                raw:true
            });


            // Authentication check
            if (!user) {
                resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.AUTHENTICATION_FAILED);
                resDTO.dataResponse.description = "User not found";
                return resDTO;
            }

            console.log("Password:", password);

            // Compare password
            const isPasswordValid = await bcrypt.compare(
                password,
                user.passwordHash
            );

            if (!isPasswordValid) {
                resDTO.dataResponse = CommonUtils.getDataResponse(
                    EReturnCodes.AUTHENTICATION_FAILED
                );

                return resDTO;
            }

            // Generate JWT
            const jwtSecret = process.env.JWT_SECRET;

            if (!jwtSecret) {
                throw new Error("JWT_SECRET is not configured");
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                },
                jwtSecret,
                {
                    expiresIn: "1d",
                }
            );

            // Prepare safe response data
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerifiedOn: user.emailVerifiedOn,
                isActive: user.isActive,
                createdOn: user.createdOn,
                token,
            };

            resDTO.dataResponse = CommonUtils.getDataResponse(
                EReturnCodes.SUCCESS
            );

            resDTO.data = userData;

            return resDTO;

        } catch (error) {
            console.error("Login user service error:", error);

            return resDTO;
        }
    };


    // GET USER BASED ON SEARCH PARAMETERS
    public async getUser(req: Request): Promise<UserMasterDTO> {

        const resDTO = new UserMasterDTO(
            CommonUtils.getDataResponse(EReturnCodes.DB_ERROR)
        );

        try {
            const { id, email, name } = req.query;

            const whereCondition: WhereOptions<UserMaster> = {
                isDeleted: 0,
            };

            if (id) {
                whereCondition.id = String(id);
            }

            if (email) {
                whereCondition.email = String(email).trim().toLowerCase();
            }

            if (name) {
                whereCondition.name = String(name).trim();
            }

            // Ensure at least one search parameter is provided
            if (!id && !email && !name) {
                resDTO.dataResponse = CommonUtils.getDataResponse(
                    EReturnCodes.INVALID_DATA
                );

                return resDTO;
            }

            const user = await UserMaster.findOne({
                where: whereCondition,
                raw: true
            });

            if (!user) {
                resDTO.dataResponse.description = "User Not Found!"
                resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.NOT_FOUND);
                return resDTO;
            }

            // Prepare safe response data
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerifiedOn: user.emailVerifiedOn,
                isActive: user.isActive,
                createdOn: user.createdOn,
            };

            resDTO.data = userData;
            resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.SUCCESS);
            return resDTO;
        } catch (error) {
            console.error("Get user service error:", error);
            return resDTO;
        }
    }

    // USER USER
    // UPDATE USER
    public async updateUser(req: Request): Promise<UserMasterDTO> {

        const resDTO = new UserMasterDTO(CommonUtils.getDataResponse(EReturnCodes.DB_ERROR));

        try {
            const userId = req?.auth_token?.userId;
            const payload = req?.body?.payload;

            // Check whether user exists
            const user = await UserMaster.findOne({
                where: {
                    id: userId,
                    isDeleted: 0,
                },
            });

            if (!user) {
                resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.NOT_FOUND);
                resDTO.dataResponse.description = "User not found";
                return resDTO;
            }

            // Normalize email if supplied
            if (payload.email !== undefined) {
                payload.email = payload.email.trim().toLowerCase();

                // Check whether email is already used by another user
                const existingUser = await UserMaster.findOne({
                    where: {
                        email: payload.email,
                        isDeleted: 0,
                        id: {
                            [Op.ne]: userId,
                        },
                    },
                });

                if (existingUser) {
                    resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.DUPLICATE_DATA);
                    resDTO.dataResponse.description = "Email is already registered";
                    return resDTO;
                }
            }

            // Determine whether email is changing
            const emailChanged = payload.email !== undefined && payload.email !== user.email;

            // Update user using payload directly
            const updatedUser = await user.update(
                payload, 
                {
                    fields: [
                        "name", 
                        "email"
                    ],
                }
            );

            if(!updatedUser){
                resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.DB_ERROR);
                resDTO.dataResponse.description = "Failed to update user";
                return resDTO;
            }

            // Reset email verification if email changes
            if (emailChanged) {
                await user.update(
                    {
                        emailVerifiedOn: null,
                    },
                    {
                        fields: ["emailVerifiedOn"],
                    }
                );
            }

            // Prepare safe response data
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerifiedOn: user.emailVerifiedOn,
                isActive: user.isActive,
                createdOn: user.createdOn,
            };

            resDTO.dataResponse = CommonUtils.getDataResponse(EReturnCodes.SUCCESS);
            resDTO.data = userData;
            return resDTO;
        } catch (error) {
            console.error("Update user service error:", error);
            return resDTO;
        }
    }
}

export default new UserService();