import { Sequelize, Model, DataTypes } from "sequelize";

// Create Sequelize isntance
const dbPath = process.env.ENVIRONMENT === "dev" ? ".content/" : "dist/";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: `${dbPath}db/database.sqlite`,
  logging: process.env.ENVIRONMENT === "dev",
});

// Define Page model
class Page extends Model {}
Page.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, unique: true },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    version: DataTypes.NUMBER,
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "page" }
);

// Sync model with database
console.log("DB initialized: ", `${dbPath}db/database.sqlite`);
export const page = Page;
