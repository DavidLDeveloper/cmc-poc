import express from "express";
import path from "path";
import marked from "./src/controller/lib/marked.js";
import fs from "fs";
import bodyParser from "body-parser";
import { readPage, updateOrCreatePage } from "./src/model/helpers/page.js";
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
app.use(express.static(path.join(__dirname, "dist/static")));
app.use((req, res) => {
  res.send("404");
});

// Startup:

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
