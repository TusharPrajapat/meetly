
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../../database/db";
import { IDataResponse, IResponse } from "../../common/interfaces/responseInterface";
import BaseResponse from "../../common/models/baseResponse";

export class UserMasterDTO extends BaseResponse{
    
}

export class UserMaster extends Model {
    public id!: bigint;
    public name!: string;
    public email!: string;
    public passwordHash!: string;
    public emailVerifiedOn!: Date | null;
    public isActive!: number;
    public createdOn!: Date;
    public updatedOn!: Date;
    public updatedBy!: bigint | null;
    public isDeleted!: number;
    public deletedBy!: string | null;
    public deletedOn!: Date | null;
}

UserMaster.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        passwordHash: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: "password_hash",
        },
        emailVerifiedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            field: "email_verified_on",
        },
        isActive: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 1,
            field: "is_active",
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_on",
        },
        updatedOn: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "updated_on",
        },
        updatedBy: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            field: "updated_by",
        },
        isDeleted: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
            field: "is_deleted",
        },
        deletedBy: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
            field: "deleted_by",
        },
        deletedOn: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            field: "deleted_on",
        },
    },
    {
        sequelize,
        modelName: "UserMaster",
        tableName: "user_master",
        schema: "user_management",
        timestamps: false,
    }
);
