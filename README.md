# Tutorial Project

## Pre-requirement

### 安裝 npm

如果你的系統中尚未安裝 npm，你可以通過以下步驟進行安裝：

1. 安裝 [Node.js](https://nodejs.org/)，它包含了 npm。你可以從 [Node.js 官網](https://nodejs.org/) 下載並安裝適合你操作系統的版本。

2. 安裝完成後，打開終端並運行以下命令來確認安裝是否成功：

   ```sh
   node -v
   npm -v
   ```

   這將顯示已安裝的 Node.js 和 npm 的版本號。

### 使用 npm 安裝 pnpm

有了 npm 之後，你可以通過以下命令安裝 pnpm：

1. 在終端運行以下命令：

```sh
npm install -g pnpm
```

這將全局安裝 pnpm，使其可在任何位置使用。

- 安裝完成後，你可以運行以下命令來確認安裝是否成功：

```sh
pnpm -v
```

這將顯示已安裝的 pnpm 的版本號。

## Quick Start

Monorepo 包含兩個主要部分：客戶端和伺服端。你可以使用 pnpm 來快速開始運行這些部分。

1. 安裝所有依賴：

   ```sh
   pnpm install
   ```

2. 運行客戶端：

   ```sh
   pnpm run client
   ```

   這將運行客戶端應用。

3. 運行伺服端：

   ```sh
   pnpm run server
   ```

   這將運行伺服端應用。

4. 同時運行兩個專案：

   ```sh
   pnpm run dev
   ```

   這將運行伺服端應用。

### 專案檔案

`projects` 目錄底下是子專案：

- web-ui 是客戶端的專案，使用 React 重新撰寫過一次
- web-server 是伺服器端的專案，尚未重新編寫

當你執行 `pnpm run dev` 後，可以先打開 `http://localhost:5173/room/test` 進入房間頁面

![tool](https://developer.chrome.com/static/blog/new-in-devtools-74/image/after-clicking-ws-websoc-0dc03d2aa2f95_856.png?hl=zh-tw)

點開 `Websocket` 除錯工具(F12 -> 找到 Tab 頁籤 -> 點擊 `ws` 過濾資訊)，如上圖所示

在客戶端的 `src/hooks/useClient` 檔案中， `connect` 函式包含了一組基礎的連線範例。

此處為了方便，使用了 `socket.io` 作為客戶端以及伺服器端函式庫

一個簡單的範例如下：

客戶端程式碼：

```javascript
const socket = io(url);

// 對伺服器
socket.once("open", () => {
  socket.emit("Event-Name", ...args);
})
```

伺服端程式碼：

```javascript
io.on("connect", (client) => {
  client.on("Event-Name", (...args) => {
    console.log(args);
    client.emit("Event", "");
  });
});
```

對於 `socket` 來說

- `on` 監聽一個事件，並且當收到事件時，執行對應的 `callback` 函式
  - `callback` 函式的參數，跟`emit`時傳入的引數相同
- `emit` 發射一個事件到連線端，後面可以包含任意**可格式化**的參數

可格式化的意思是，可以使用文字完整的表達

- 簡單數據類型：如`string`、`number`、`boolean`、`null` 和 `undefined`，這些都可以被轉換。
- Pure Object和 `array`：這些是最常見的可以被轉換的數據結構。
  - 但`Object`中不可包含不能被轉換的數據類型。
- `Function` 和 Symbol：這些數據類型不能被轉換，當對象中包含這些類型的屬性時，這些屬性會被忽略。