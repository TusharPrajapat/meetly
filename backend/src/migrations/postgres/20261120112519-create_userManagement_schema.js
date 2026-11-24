module.exports = {
    up: `
        CREATE SCHEMA IF NOT EXISTS user_management;
    `,

    down: `
        DROP SCHEMA IF EXISTS user_management;
    `
};