type ConfigOption = {
  /** React or Vue */
  type: string;
  /** 是否添加css浏览器前缀 */
  isCompatibleCss3: boolean;
  /** 是否兼容低版本浏览器 */
  isCompatibleLowBrowser: boolean;
  /** 是否兼容装饰器语法 */
  isCompatibleDecorator: boolean;
  /** 优化项 */
  optimizationItems: string[];
};
