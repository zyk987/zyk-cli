import inquirer, { QuestionCollection } from "inquirer";
import { generateTemplate, generateWebpackConfig } from "./generate";

import Options from "utils/options";

const opts = Options.getInstance();

const inquiry = async () => {
  const promptList: QuestionCollection<any> = [
    {
      name: "type",
      type: "list",
      message: "请选择模板类型",
      choices: [
        {
          name: "React",
          value: "React",
        },
        {
          name: "Vue",
          value: "Vue",
        },
      ],
    },
    {
      name: "isCompatibleCss3",
      type: "confirm",
      message: "是否给css添加浏览器前缀",
    },
    {
      name: "isCompatibleLowBrowser",
      type: "confirm",
      message: "是否兼容低版本浏览器",
    },
    {
      name: "isCompatibleDecorator",
      type: "confirm",
      message: "是否兼容类装饰器语法",
    },
    {
      name: "optimizationItems",
      type: "checkbox",
      message: "请选择需要的优化项",
      choices: [
        {
          name: "开启文件缓存",
          value: "isOpenStorageCache",
          checked: true,
        },
        {
          name: "开启多线程loader解析",
          value: "isOpenThreadLoader",
          checked: true,
        },
        {
          name: "抽离css文件",
          value: "isPulloutCssFile",
          checked: true,
        },
        {
          name: "压缩css和js文件",
          value: "isCompressJsAndCssFile",
          checked: true,
        },
        {
          name: "清理未使用css样式",
          value: "isTreeShakingCss",
          checked: true,
        },
        {
          name: "开启gzip压缩",
          value: "isCreateGzipFile",
          checked: true,
        },
      ],
    },
  ];

  const options = await inquirer.prompt(promptList);

  for (const [k, v] of Object.entries(options)) {
    opts.set(k, v);
  }
  generateTemplate();
  generateWebpackConfig();
};

export default inquiry;
