require("dotenv").config();

const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const migrationsDir = path.join(
  __dirname,
  "src/migrations/postgres"
);

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false
  }
);

const META_TABLE = "migrations_meta";

// ------------------------------
// Create migration file
// ------------------------------
function addMigration() {
  const fileName = process.argv[3];

  if (!fileName) {
    throw new Error(
      "Please provide a migration name. Example: npm run addMigration -- create-users"
    );
  }

  // Prevent unsafe filenames
  const safeName = fileName.replace(/[^a-zA-Z0-9_-]/g, "-");

  if (!safeName) {
    throw new Error("Invalid migration name.");
  }

  fs.mkdirSync(migrationsDir, { recursive: true });

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);

  const newFileName = `${timestamp}-${safeName}.js`;
  const filePath = path.join(migrationsDir, newFileName);

  if (fs.existsSync(filePath)) {
    throw new Error(`Migration already exists: ${newFileName}`);
  }

  const template = `module.exports = {
    up: \`
        -- Write your UP SQL here
    \`,

    down: \`
        -- Write your DOWN SQL here
    \`
    };
    `;

  fs.writeFileSync(filePath, template);

  console.log(`Created migration: ${newFileName}`);
}

// ------------------------------
// Ensure metadata table exists
// ------------------------------
async function ensureMetaTable() {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS ${META_TABLE} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// ------------------------------
// Get migration files
// ------------------------------
function getMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".js"))
    .sort();
}

// ------------------------------
// Run pending migrations
// ------------------------------
async function upMigration() {
  await sequelize.authenticate();
  console.log("Connected to PostgreSQL.");

  await ensureMetaTable();

  const files = getMigrationFiles();

  for (const file of files) {
    const transaction = await sequelize.transaction();

    try {
      // Prevent concurrent migration runners
      await sequelize.query(
        "SELECT pg_advisory_xact_lock(987654321)",
        { transaction }
      );

      const [rows] = await sequelize.query(
        `SELECT name FROM ${META_TABLE} WHERE name = :name`,
        {
          replacements: { name: file },
          transaction
        }
      );

      if (rows.length > 0) {
        await transaction.commit();
        console.log(`Skipped: ${file}`);
        continue;
      }

      console.log(`Running: ${file}`);

      const migration = require(path.join(migrationsDir, file));

      if (typeof migration.up !== "string") {
        throw new Error(
          `${file} must export an up SQL string`
        );
      }

      await sequelize.query(migration.up, { transaction });

      await sequelize.query(
        `INSERT INTO ${META_TABLE} (name) VALUES (:name)`,
        {
          replacements: { name: file },
          transaction
        }
      );

      await transaction.commit();

      console.log(`Success: ${file}`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  console.log("All migrations completed.");
}

// ------------------------------
// Rollback latest migration
// ------------------------------
async function downMigration() {
  await sequelize.authenticate();
  console.log("Connected to PostgreSQL.");

  await ensureMetaTable();

  const transaction = await sequelize.transaction();

  try {
    await sequelize.query(
      "SELECT pg_advisory_xact_lock(987654321)",
      { transaction }
    );

    const [rows] = await sequelize.query(
      `SELECT name FROM ${META_TABLE}
       ORDER BY id DESC
       LIMIT 1`,
      { transaction }
    );

    if (rows.length === 0) {
      await transaction.commit();
      console.log("No migrations to revert.");
      return;
    }

    const lastMigration = rows[0].name;

    console.log(`Reverting: ${lastMigration}`);

    const migrationPath = path.join(
      migrationsDir,
      lastMigration
    );

    if (!fs.existsSync(migrationPath)) {
      throw new Error(
        `Migration file not found: ${lastMigration}`
      );
    }

    const migration = require(migrationPath);

    if (typeof migration.down !== "string") {
      throw new Error(
        `${lastMigration} must export a down SQL string`
      );
    }

    await sequelize.query(migration.down, { transaction });

    await sequelize.query(
      `DELETE FROM ${META_TABLE} WHERE name = :name`,
      {
        replacements: { name: lastMigration },
        transaction
      }
    );

    await transaction.commit();

    console.log(`Reverted: ${lastMigration}`);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// ------------------------------
// Main
// ------------------------------
async function main() {
  const action = process.argv[2];

  try {
    switch (action) {
      case "addMigration":
        addMigration();
        break;

      case "upMigration":
        await upMigration();
        break;

      case "downMigration":
        await downMigration();
        break;

      default:
        console.log(`
            Available commands:

            npm run addMigration -- migration-name
            npm run upMigration
            npm run downMigration
        `);
    }
  } catch (error) {
    console.error("Migration error:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();