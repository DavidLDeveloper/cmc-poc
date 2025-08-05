import { Sequelize, Model, DataTypes } from "sequelize";

// Create Sequelize isntance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "dist/db/database.sqlite",
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
  },
  { sequelize, modelName: "page" }
);

// Sync model with database
await sequelize.sync();

export const page = Page;
