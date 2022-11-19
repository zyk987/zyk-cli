#! /usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
// import create from '../create'
import { readFileSync } from "node:fs";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url)).toString()
);
const program = new Command();

// 创建文件命令
program
  .command("create <project-name>")
  .description("create a new project")
  .option("-f --force", "if it exist, overwrite directory")
  .action((name: string, options: any) => {
    console.log("准备创建的项目名称", name, options);
  });

// 配置版本号信息
program.version(version).usage("<command> [option]");

// 配置帮助信息
program.on("--help", () => {
  console.log(
    `\r\n Run ${chalk.green(
      `dyi <command> --help`
    )} to understand the details \r\n `
  );
});

// 解析参数
program.parse(process.argv);
