# vue2023-hexschool-week7

This template should help get you started developing with Vue 3 in Vite.

## 第七週 - 網頁美感大揭密

作業資源：
主線任務
在先前的課程中，已經介紹了登入、產品列表的製作，請同學完成剩下功能，並整合至 Vite 中。另外還要請大家確定好最終作業的主題唷！

## 後台

### 產品頁面：

* 串接取得、新增、刪除、更新產品 API
* 啟用狀態顯示
* Modal 細節欄位
* 上傳圖片API
* 分頁功能

### 訂單頁面：

* 串接取得、刪除、更新訂單 API
* Modal 細節欄位
* 付款狀態切換
* 分頁功能

### 優惠券頁面：

* 串接取得、新增、刪除、更新優惠券 API
* 啟用狀態顯示
* Modal 細節欄位
* 分頁功能

### 貼文頁面（加分項目）：

* 串接取得、新增、刪除、更新貼文 API
* 啟用公開狀態
* Modal 細節欄位
* 分頁功能
* 登入 / 登出

### 小功能

* alert、loading 元件
* 串接圖片上傳 API

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
