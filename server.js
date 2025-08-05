import express from "express";
import path from "path";
import bodyParser from "body-parser";
import pageController from "./src/controller/page-controller.js";
import editorRouter from "./src/controller/editor-controller.js";
const app = express();
app.use(bodyParser.json());

const __dirname = import.meta.dirname;
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Layer 3: Model
// Sqlite DB managed in src/models/lib/sql.js

// Layer 2: Controller
// Update static content, serve dynamic content, and biz logic.

app.use(pageController);
app.use("/editor", editorRouter);

// Layer 1: Content
// Static Content Module -- dev modes
const contentDir = path.join(
  __dirname,
  `${process.env.ENVIRONMENT === "dev" ? "dist/" : ""}static`
);

app.use(express.static(contentDir));
app.use((req, res) => {
  res.send("404");
});

// Startup:
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
