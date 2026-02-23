# Aphelion Desktop

## 開發模式
1. 先在 `frontend/admin-app` 啟動前端：
   - `npm install`
   - `npm run dev`
2. 另一個終端啟動桌面應用：
   - `cd desktop`
   - `npm install`
   - `set APP_DEV_URL=http://localhost:5175`
   - `npm run dev`

## 打包
1. 先確保前端可建置：
   - `cd frontend/admin-app`
   - `npm install`
   - `npm run build`
2. 回到 `desktop` 目錄：
   - Windows：`npm run pack:win`
   - macOS：`npm run pack:mac`
   - 同時：`npm run pack:all`

## 本地資料庫
SQLite 檔案位置：
- 開發模式：`%APPDATA%/aphelion-desktop/pos.sqlite`
- 打包後：`%APPDATA%/Aphelion Apollo POS/pos.sqlite`
