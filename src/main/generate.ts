import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import { write } from "utils/file";
import Options from "utils/options";
import Package from "utils/package";
import initBaseConfig from "./initWebpackConfig/initBase";
import initDevConfig from "./initWebpackConfig/initDev";
import initProdConfig from "./initWebpackConfig/initProd";

const opts = Options.getInstance();
const pkg = Package.getInstance();

export const generateTemplate = () => {
  const templatePath = path.resolve(
    fileURLToPath(import.meta.url),
    "../../",
    `templates/${opts.get("type")}`
  );
  opts.set("templatePath", templatePath);

  const files = fs.readdirSync(templatePath);
  for (const file of files.filter((f) => f)) {
    if (file === "package.json") {
      const templatePackage = fs.readJsonSync(
        path.join(opts.get("templatePath"), file),
        "utf-8"
      );
      const currentPackage = pkg.get();
      for (const [k, v] of Object.entries(templatePackage)) {
        if (["dependencies", "devDependencies"].includes(k))
          pkg.set(k, {
            ...currentPackage[k],
            ...(typeof v === "object" ? v : {}),
          });
      }
    } else {
      write(file);
    }
  }
};

export const generateWebpackConfig = () => {
  pkg.set("scripts", {
    "dev:dev":
      "cross-env NODE_ENV=development BASE_ENV=development webpack-dev-server -c build/webpack.dev.js",
    "dev:test":
      "cross-env NODE_ENV=development BASE_ENV=test webpack-dev-server -c build/webpack.dev.js",
    "dev:pre":
      "cross-env NODE_ENV=development BASE_ENV=pre webpack-dev-server -c build/webpack.dev.js",
    "dev:prod":
      "cross-env NODE_ENV=development BASE_ENV=production webpack-dev-server -c build/webpack.dev.js",

    "build:dev":
      "cross-env NODE_ENV=production BASE_ENV=development webpack -c build/webpack.prod.js",
    "build:test":
      "cross-env NODE_ENV=production BASE_ENV=test webpack -c build/webpack.prod.js",
    "build:pre":
      "cross-env NODE_ENV=production BASE_ENV=pre webpack -c build/webpack.prod.js",
    "build:prod":
      "cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.prod.js",
  });

  fs.mkdir(path.resolve(opts.get("base"), "build"));
  initBaseConfig();
  initDevConfig();
  initProdConfig();
};
