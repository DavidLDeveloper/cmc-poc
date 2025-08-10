import copy from "rollup-plugin-copy";

export default [
  {
    input: "server.js",
    output: {
      file: "dist/server.js",
      format: "es",
    },
    plugins: [
      copy({
        targets: [
          { src: "src/components", dest: "dist/src" },
          { src: "src/styles.css", dist: "dist/static" },
        ],
      }),
    ],
  },
];
