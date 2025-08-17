import express from "express";
import path from "path";
import bodyParser from "body-parser";
import pageController, { preview } from "./src/controller/page-controller.js";
import editorRouter from "./src/controller/editor-controller.js";
import dbRouter from "./src/controller/db-controller.js";

const app = express();
app.use(bodyParser.json());

export const __dirname = import.meta.dirname;
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Layer 3: Model
// Sqlite DB managed in src/models/lib/sql.js

// Layer 2: Controller
// Update static content, serve dynamic content, and biz logic.

app.use(pageController);
app.use("/editor", editorRouter);
app.use("/database", dbRouter);

// Layer 1: Content
// Static Content Module -- dev modes
const contentDir = path.join(
  __dirname,
  `${process.env.ENVIRONMENT === "dev" ? ".content" : "static"}`
);

app.use(express.static(contentDir));
if (process.env.ENVIRONMENT === "dev") {
  // In dev: preview pages from DB if they exist. Placed after `express.static` to serve that first if it exists.
  app.use(preview);
}
app.use((req, res) => {
  res.send("404");
});

console.log(`
  ---------------
  CMC-MVP Server
  ---------------
  Version: 0.0.1
  Mode: ${process.env.ENVIRONMENT === "dev" ? "Development" : "Production"}
  Static Content Directory: ${contentDir}
  `);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
