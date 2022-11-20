import path from "node:path";
import fs from "fs-extra";
import Options from "../utils/options";

const opts = Options.getInstance();

class Package {
  private static instance: Package;
  private path: string;
  private currentPackage: any;
  constructor() {
    this.path = path.join(opts.get("base"), "/package.json");
  }

  static getInstance() {
    if (!Package.instance) {
      Package.instance = new Package();
    }
    return Package.instance;
  }

  initPath() {
    this.path = path.join(opts.get("base"), "/package.json");
    this.currentPackage = fs.readJSONSync(this.path, "utf-8");
  }

  get() {
    return this.currentPackage;
  }
  setWhole(pkg: any) {
    this.currentPackage = pkg;
  }
  set(k: string, v: any) {
    this.currentPackage[k] = v;
  }
}

export default Package;
