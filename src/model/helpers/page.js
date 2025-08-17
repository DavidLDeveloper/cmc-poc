import { page } from "../lib/sql.js";

export async function readPage(url) {
  const data = await page.findOne({ where: { url } });
  return data;
}

export async function updateOrCreatePage(url, content) {
  const [dbEntry, created] = await page.findOrCreate({
    defaults: { content, url, version: 1 },
    where: { url },
  });

  if (created) {
    // bool: true if newly created
    return { status: "created", data: dbEntry };
  } else {
    // update version and content
    dbEntry.version += 1;
    dbEntry.content = content;
    await dbEntry.save();
    return { status: "updated", data: dbEntry };
  }
}

export async function updateStatus(url, publishedStatus) {
  const dbEntry = await page.findOne({ where: { url } });
  dbEntry.published = publishedStatus;
  dbEntry.save();
  return { status: "updated", data: dbEntry };
}
