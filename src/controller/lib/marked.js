import { Marked } from "marked";

const marked = new Marked();
// TODO: Renderer settings.
const renderer = new marked.Renderer();
renderer.heading = ({ text, depth }) => {
  return `<h${depth} >${text}</h${depth}>`;
};
marked.setOptions({ renderer });

export default marked;
