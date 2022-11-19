import { defineConfig } from "rollup";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default () => {
  return defineConfig({
    input: path.resolve(__dirname, "src/bin/zyk.ts"),
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      typescript({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      commonjs({
        extensions: [".js"],
        ignore: ["bufferutil", "utf-8-validate"],
      }),
      json(),
    ],
    output: {
      file: path.resolve(__dirname, "dist/bin/index.js"),
      sourcemap: false,
      format: "cjs",
      banner: "#! /usr/bin/env node",
    },
  });
};
