import express from "express";
import { __dirname } from "../../server.js";

const dbPath =
  process.env.ENVIRONMENT === "dev"
    ? "./.content/db/database.sqlite"
    : "./db/database.sqlite";

const dbRouter = express.Router();

dbRouter.get("/download", async (req, res) => {
  res.set("Content-Disposition", `attachment; filename="database.sqlite"`);

  res.sendFile(dbPath, { dotfiles: "allow", root: __dirname }, (err) => {
    if (err) {
      console.error("Error sending database copy.");
      console.log(err);
      res
        .status(500)
        .json({ status: "failed", message: "Error sending file." });
    }
  });
});

export default dbRouter;
