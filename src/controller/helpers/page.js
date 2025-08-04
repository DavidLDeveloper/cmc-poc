import marked from "../lib/marked.js";
import fs from "fs";
import path from "path";

export const createPageHTML = (url, mdContent) => {
  let html = fs.readFileSync(path.join("src/components/index.html"), "utf8");
  const content = marked.parse(mdContent);
  return html.replace(
    `<main id="main_content"></main>`,
    `<main id="main_content">${content}</main>`
  );
};
