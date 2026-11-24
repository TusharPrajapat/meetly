module.exports = {
  up: `
    CREATE TABLE IF NOT EXISTS user_management.user_master (
        id BIGSERIAL PRIMARY KEY,

        name VARCHAR(150) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,

        email_verified_on TIMESTAMPTZ NULL,

        is_active SMALLINT NOT NULL DEFAULT 1,
        is_deleted SMALLINT NOT NULL DEFAULT 0,

        created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        updated_by BIGINT NULL,
        deleted_by BIGINT NULL,
        deleted_on TIMESTAMPTZ NULL,

        CONSTRAINT user_master_is_active_check
            CHECK (is_active IN (0, 1)),

        CONSTRAINT user_master_is_deleted_check
            CHECK (is_deleted IN (0, 1)),

        CONSTRAINT user_master_soft_delete_check
            CHECK (
                (is_deleted = 0 AND deleted_on IS NULL)
                OR
                (is_deleted = 1 AND deleted_on IS NOT NULL)
            )
    );
  `,

  down: `
    DROP TABLE IF EXISTS user_management.user_master;
  `
};