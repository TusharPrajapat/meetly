import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: true,
    }
);

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log(`Database connected successfully: ${process.env.DB_DATABASE_NAME}`);
    } catch (err: unknown) {
        console.error("Database connection error:", err);
        throw err;
    }
};
