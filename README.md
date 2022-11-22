## 快速开始

```sh
    npm i -g zyk-cli

    zyk create projectName

    cd projectName && npm run dev:dev
```

Then open http://localhost:8080/ to see your app.

## 创建一个新项目

### yarn

```sh
    yarn -g zyk-cli
```

### npm

```sh
    npm i -g zyk-cli
```

Start creating a new project after installation.

```sh
    zyk create projectName
```

It will create a project folder named `projectName` in the current folder.
In this folder, the initial project structure will be generated and dependent modules will be installed.
The project structure is as follows:

### React

```
projectName
├── build
│ ├── webpack.base.js
│ ├── webpack.dev.js
│ └── webpack.prod.js
├── node_modules
├── public
│ ├── favicon.ico
│ ├── index.html
│ ├── logo192.png
│ └── logo512.png
├── src
│ ├── App.css
│ ├── App.tsc
│ ├── index.css
│ ├── index.tsc
│ ├── logo.svg
│ └── typings.d.ts
├── .browserslistrc
├── babel.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

### Vue

```
projectName
├── build
│ ├── webpack.base.js
│ ├── webpack.dev.js
│ └── webpack.prod.js
├── node_modules
├── public
│ ├── vue.svg
│ └── index.html
├── src
│ ├── components
│ │ └── HelloWorld.vue
│ ├── App.vue
│ ├── main.ts
│ ├── style.css
│ └── typing.d.ts
├── .browserslistrc
├── babel.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 启动、打包

```sh
    cd projectName

    npm run dev:dev
    npm run dev:prod

    npm build build:dev
    npm build build:prod
```
