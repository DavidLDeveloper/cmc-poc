import express from "express";
import { readPage, updateOrCreatePage } from "../model/helpers/page.js";
import fs from "fs";
import path from "path";
import { createPageHTML } from "./helpers/page.js";

const __dirname = import.meta.dirname;
const editorRouter = express.Router();

// Build a page into ./dist/static
editorRouter.get("/", async (req, res) => {
  const { url } = req.query;
  const data = await readPage(url);
  const contentBuffer = fs.readFileSync(
    path.join("src/components/editor.html")
  );
  const content = contentBuffer.toString();
  const hydratedContent = content.replace("{content}", String(data.content));
  if (data) {
    const html = createPageHTML(null, hydratedContent);
    res.send(html);
  } else {
    res.json({ status: "failed", message: "Page data not found." });
  }
});

export default editorRouter;
