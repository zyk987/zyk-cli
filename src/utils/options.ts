type OptionType = {
  base: string;
  templatePath: string;
  [key: string]: any;
} & Partial<ConfigOption>;

class Options {
  private static instance: Options;
  private opts: OptionType;

  constructor() {
    this.opts = {
      base: "/",
      templatePath: "/",
    };
  }

  static getInstance() {
    if (!Options.instance) {
      Options.instance = new Options();
    }
    return Options.instance;
  }

  set(k: string, v: any) {
    this.opts[k] = v;
  }

  get(k: keyof OptionType) {
    return this.opts[k];
  }

  getAll() {
    return this.opts;
  }
}

export default Options;
