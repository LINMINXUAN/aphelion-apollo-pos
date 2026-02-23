# Breakfast POS - 平板點餐系統

這是一個使用 **Vite + React + TypeScript** 建立的早餐店 POS 平板點餐系統。

## 🚀 技術棧

- **React 18** - UI 框架
- **TypeScript 5** - 型別安全
- **Vite** - 快速建置工具
- **TailwindCSS 3** - Utility-first CSS 框架
- **TanStack Query** - 伺服器狀態管理
- **Zustand** - 客戶端狀態管理（購物車）
- **Axios** - HTTP 客戶端

## 📦 安裝依賴

請先確保已安裝 **Node.js >= 18** 與 **npm >= 9**。

```bash
npm install
```

## 🛠 開發模式

```bash
npm run dev
```

應用將啟動於 `http://localhost:5173`

## 🏗 建置生產版本

```bash
npm run build
```

建置產物將輸出至 `dist/` 目錄。

## 📁 專案結構

```
src/
├── components/       # UI Components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── ProductCard.tsx
│   └── Cart.tsx
├── pages/            # 頁面組件
│   └── MenuPage.tsx
├── hooks/            # Custom React Hooks
│   ├── useProducts.ts
│   ├── useCategories.ts
│   └── usePlaceOrder.ts
├── services/         # API Client
│   └── api.ts
├── stores/           # Zustand Stores
│   └── cartStore.ts
├── types/            # TypeScript 型別定義
│   └── api.ts
├── App.tsx           # 主應用組件
├── main.tsx          # React 入口點
└── index.css         # 全域樣式
```

## 🎨 Design System

### 色彩主題
- **Primary**: 橘色系 (`#f97316`)
- **Secondary**: 粉紅色系 (`#ec4899`)
- **Glassmorphism**: 毛玻璃效果卡片

### 主要組件
- **Button**: Primary、Secondary、Ghost 三種樣式
- **Card**: Glassmorphism 風格卡片
- **Badge**: 售罄、熱銷、新品標籤
- **ProductCard**: 商品展示卡片
- **Cart**: 購物車側邊欄

## 🔌 API 連線

預設連線至 `http://localhost:8080/api`，可透過 `.env.development` 修改：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📝 開發規範

- 使用 **TypeScript Strict Mode**
- 遵循 **ESLint** 規則
- 組件使用 **Function Component** + **Hooks**
- API 呼叫透過 **TanStack Query** 管理
- 購物車狀態使用 **Zustand** 管理

## 🧪 後續開發

- [ ] 實作 React Router（多頁面）
- [ ] 新增登入/登出功能
- [ ] 訂單歷史查詢頁面
- [ ] 管理後台介面
- [ ] Unit Tests (Vitest)
- [ ] E2E Tests (Playwright)

---

**Last Updated**: 2026-01-10  
**Developer**: Frontend Team  
**Project**: Aphelion Apollo - Breakfast POS System
