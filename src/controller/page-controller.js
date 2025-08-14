import express from "express";
import { readPage, updateOrCreatePage } from "../model/helpers/page.js";
import fs from "fs";
import path from "path";
import { createPageHTML } from "./helpers/page.js";

const router = express.Router();

const buildDir =
  process.env.ENVIRONMENT === "dev" ? ".content/" : "/dist/static/";
// Build a page into ./dist/static
router.post("/build", async (req, res) => {
  const { url } = req.query;
  const filePath = path.join(buildDir, url);
  const data = await readPage(url);
  if (data) {
    fs.mkdirSync(filePath, {
      recursive: true,
    });
    fs.writeFileSync(
      `${filePath}/index.html`,
      createPageHTML(null, data.content)
    );
    res.json({ status: "success", path: req.path, route: url, filePath });
  } else {
    res.json({ status: "failed", message: "Page data not found." });
  }
});

export const preview = async (req, res, next) => {
  const url = req.url;
  const data = await readPage(url);
  if (data) {
    console.log("Previewing:", url);
    const pageContent = createPageHTML(null, data.content);
    res.send(pageContent);
  } else {
    next();
  }
};

// Create or update a page in the DB based on on url as the key.
router.post("/create", async (req, res) => {
  if (!req.body?.content && !req.body?.url) {
    res.status(400);
    res.send("400: Bad Request");
  }

  const { content, url } = req.body;
  const data = await updateOrCreatePage(url, content);
  res.json(data);
});

// Fetch the DB entry for a url.
router.get("/data", async (req, res) => {
  const data = await readPage(req.query.url);
  res.json(data);
});

export default router;
