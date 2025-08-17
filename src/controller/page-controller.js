import express from "express";
import {
  readPage,
  updateOrCreatePage,
  updateStatus,
} from "../model/helpers/page.js";
import fs from "fs";
import path from "path";
import { createPageHTML } from "./helpers/page.js";

const router = express.Router();

const buildDir =
  process.env.ENVIRONMENT === "dev" ? ".content/" : "/dist/static/";
// Build a page into ./dist/static
router.post("/build", async (req, res) => {
  const { url } = req.query;
  const filePath = path.join(".", buildDir, url);
  const data = await readPage(url);

  if (data) {
    fs.mkdirSync(filePath, {
      recursive: true,
    });
    fs.writeFileSync(
      `${filePath}/index.html`,
      createPageHTML(null, data.content)
    );
    await updateStatus(url, true);
    res.json({ status: "success", path: req.path, route: url, filePath });
  } else {
    res.json({ status: "failed", message: "Page data not found." });
  }
});

router.put("/unbuild", async (req, res) => {
  const { url } = req.query;
  const filePath = path.join(".", buildDir, url);
  console.log("Removing path:", url);
  if (fs.existsSync(path.join(filePath, "index.html"))) {
    fs.unlinkSync(path.join(filePath, "index.html"), (err) => {
      if (err) {
        console.error("Error deleting path:", err);
        return;
      }
    });

    try {
      fs.rmdirSync(filePath);
      console.log("Directory removed:", filePath);
    } catch (err) {
      // todo: verify windows code...
      if (err.code === "ENOTEMPTY") return;
      console.log("Error removing directory: ", err);
    }

    await updateStatus(url, false);
    console.log("Path removed successfully.");
    res.json({ status: "success", path: req.path, route: url, filePath });
  } else {
    console.log("Path does not exists.");
    res.json({ status: "failed", message: "Path does not exsist." });
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

router.delete("/delete", async (req, res) => {
  const { content, url } = req.body;
  const page = await readPage(url);

  if (page.published) {
    res.status(409); // 409 -- Conflict
    res.json({
      status: "failed",
      message: "Cannot delete published resource.",
    });
  }

  await page.destroy();
  res.status(202);
  res.json({ status: "success" });
});

export default router;
