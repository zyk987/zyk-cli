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
    // {
    //   name: "optimizationItems",
    //   type: "checkbox",
    //   message: "请选择需要的优化项",
    //   choices: [{ name: "is" }],
    // },
  ];

  const options = await inquirer.prompt(promptList);

  for (const [k, v] of Object.entries(options)) {
    opts.set(k, v);
  }

  generateTemplate();
  generateWebpackConfig();
};

export default inquiry;
