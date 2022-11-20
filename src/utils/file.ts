import fs from "fs-extra";
import path from "node:path";
import Options from "./options";

const opts = Options.getInstance();

export const write = (file: string, content?: string) => {
  const targetPath = path.join(opts.get("base"), file);
  if (content) {
    if (!fs.existsSync(targetPath)) {
      fs.writeFile(targetPath, content);
    } else {
      fs.writeFileSync(targetPath, content);
    }
  } else {
    copy(path.join(opts.get("templatePath"), file), targetPath);
  }
};

export const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
};

export const copyDir = (srcDir: string, destDir: string) => {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
};

export const isEmpty = (path: string) => {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
};

export const emptyDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue;
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
};
