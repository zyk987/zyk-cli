import chalk from "chalk";
import { existsSync, removeSync } from "fs-extra";
import inquirer from "inquirer";
import path from "path";
import { exec } from "node:child_process";
import Package from "utils/package";
import Options from "utils/options";
import inquiry from "./inquiry";
import { write } from "utils/file";
import ora from "ora";

const pkg = Package.getInstance();
const opts = Options.getInstance();
const spinner = ora();

const Create = async (name: string, options: any) => {
  const cwd = process.cwd();
  const targetPath = path.join(cwd, name);

  if (existsSync(targetPath)) {
    if (options.force) {
      removeSync(targetPath);
    } else {
      const { replace } = await inquirer.prompt([
        {
          name: "replace",
          type: "list",
          message: `项目已存在、是否确认覆盖? ${chalk.grey(
            "覆盖后原项目无法恢复"
          )}`,
          choices: [
            { name: "确认覆盖", value: true },
            { name: "再考虑下，暂不覆盖", value: false },
          ],
        },
      ]);
      if (!replace) {
        return;
      }
      removeSync(targetPath);
    }
  }

  exec(`mkdir ${name} && cd ${name} && npm init -y`, async (err) => {
    if (err) {
      console.log(chalk.red("初始化失败！"));
      return;
    }
    opts.set("base", path.join(process.cwd(), `/${name}`));
    pkg.initPath();

    await inquiry();

    write(path.join("package.json"), JSON.stringify(pkg.get(), null, 2));

    spinner.start();
    spinner.text = "Downloading...";
    exec(`cd ${name} && npm install`, (e) => {
      if (e) {
        spinner.stop();
        spinner.fail(chalk.red("依赖安装失败！"));
      } else {
        spinner.stop();
        spinner.succeed(chalk.green("Download Succeeded"));
      }
    });
  });
};

export default Create;
