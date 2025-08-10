import { Marked } from "marked";

const marked = new Marked();
// TODO: Renderer settings.
const renderer = new marked.Renderer();
renderer.heading = ({ text, depth }) => {
  console.log(text, depth);
  return `<h${depth} class="text-2xl">${text}</h${depth}>`;
};
marked.setOptions({ renderer });

export default marked;
