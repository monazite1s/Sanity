---
title: React基础使用（一）
slug: React-Foundation-1
order: 1
---

## React 安装

> 使用 create-react-app

```cmd
npm i -g create-react-app
#全局安装create-react-app

...
#进入创建项目的目录,略

create-react-app YOUR_PROJECT
#创建名为“YOUR_PROJECT”的项目
```

> 使用 Vite 创建 react 脚手架

{/* more */}

```cmd
#Vite 需要 Node.js 版本 18+，20+。

npm create vite@latest
? Project name: » vite-project
#项目名称
? Select a framework: » - Use arrow-keys. Return to submit.
 ...
    Vue
>   React
    Preact
    ...
#选择框架
? Select a variant: » - Use arrow-keys. Return to submit.
>   TypeScript
    TypeScript + SWC
    JavaScript
    JavaScript + SWC
#选择需要的配置，SWC是将ES6语法转换为ES5语法的工具
```

## React 概览

### 组件的创建与嵌套

React 应用程序是由 **组件** 组成的。一个组件是 UI（用户界面）的一部分，它拥有自己的逻辑和外观。组件可以小到一个按钮，也可以大到整个页面。

相比于 Vue，React 的组件更偏向于纯粹的 `JS` ，React 组件是返回标签的 `JavaScript` 函数

```jsx
import "./style.css";

//可以引入样式

function MyButton() {
    //一些其他逻辑
    return <button>I'm a button</button>;
}
```

... (内容已根据 data.ndjson 截取)

