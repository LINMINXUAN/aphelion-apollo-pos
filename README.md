# Sunrise Bites POS System

早餐店 POS 系統 — 涵蓋 **後端 API**、**前端 Web App**、**桌面應用程式** 三端的完整解決方案。

---

## 目錄

- [專案簡介](#專案簡介)
- [系統架構總覽](#系統架構總覽)
- [技術棧](#技術棧)
- [專案目錄結構](#專案目錄結構)
- [快速開始](#快速開始)
- [前端 Web 應用](#前端-web-應用)
- [桌面應用程式](#桌面應用程式)
- [環境配置](#環境配置)
- [API 文件](#api-文件)
- [資料庫](#資料庫)
- [測試](#測試)
- [Docker 部署](#docker-部署)
- [架構改進紀錄](#架構改進紀錄)

---

## 專案簡介

本系統為早餐店提供完整的 POS 解決方案，支援 **兩種運行模式**：

### 模式 A：網路版（多端協作）

透過 Spring Boot 後端 API + PostgreSQL，適合多設備 / 多門市聯網使用。

- **Tablet POS**（Web App）→ 平板/手機 → 前台點餐
- **Admin Dashboard**（Web App）→ 電腦/平板 → 後台管理
- **Spring Boot API Server** → 統一資料存取、認證授權

### 模式 B：單機版（零配置離線）

透過 Electron 桌面應用 + SQLite，適合單店、無網路環境，開箱即用。

- **Desktop App**（.exe / .dmg）→ 內嵌管理後台 + POS 點餐
- 資料存在本地 SQLite，不需要伺服器

### 核心功能

- **前台點餐**：菜單分類瀏覽、購物車、結帳下單（內用 / 外帶）
- **後台管理**：商品 CRUD、訂單管理、營收統計圖表
- **出單列印**：預留 ESC/POS 熱感應出單機整合介面
- **LINE 通知**：預留 LINE Messaging API 訂單狀態推播
- **安全認證**：JWT + Spring Security，RBAC 角色權限控制（ADMIN / STAFF）

---

## 系統架構總覽

```
┌─────────────────────────────────────────────────────────────┐
│                     模式 A：網路版                            │
│                                                              │
│   ┌───────────────┐                 ┌────────────────────┐   │
│   │  Tablet POS   │   HTTP / REST   │                    │   │
│   │  (React 18)   │ ──────────────→ │  Spring Boot 3.2   │   │
│   │  :5173        │                 │  API Server        │   │
│   └───────────────┘                 │                    │   │
│   ┌───────────────┐   HTTP / REST   │  ┌──────────────┐  │   │
│   │  Admin App    │ ──────────────→ │  │ PostgreSQL   │  │   │
│   │  (React 19)   │                 │  │ + Flyway     │  │   │
│   │  :5177        │                 │  └──────────────┘  │   │
│   └───────────────┘                 └────────────────────┘   │
│                                           :8080              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     模式 B：單機版                            │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               Electron Desktop App                   │   │
│   │                                                      │   │
│   │   ┌───────────────┐     IPC      ┌──────────────┐   │   │
│   │   │  Admin App    │ ──────────→  │   SQLite     │   │   │
│   │   │  (內嵌 React)  │   (posApi)   │   本地資料庫  │   │   │
│   │   └───────────────┘              └──────────────┘   │   │
│   │                                                      │   │
│   └─────────────────────────────────────────────────────┘   │
│              Aphelion Apollo POS (.exe / .dmg)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 技術棧

### 後端 (Backend)

| 類別 | 技術 |
|------|------|
| 語言 | Java 21 (Record, Pattern Matching, Stream API) |
| 框架 | Spring Boot 3.2.5 |
| 安全 | Spring Security 6 + JWT (jjwt 0.11.5) |
| ORM | Spring Data JPA + Hibernate |
| 資料庫 | PostgreSQL (prod) / H2 (dev) |
| 資料庫遷移 | Flyway |
| DTO 映射 | MapStruct 1.5.5 |
| API 文件 | SpringDoc OpenAPI 2.3 (Swagger UI) |
| 建構工具 | Maven + Maven Wrapper |
| 測試 | JUnit 5 + Mockito + Spring Security Test |
| 程式碼覆蓋 | JaCoCo |
| 容器化 | Docker + Docker Compose |
| 簡化工具 | Lombok 1.18.30 |

### 前端 (Frontend)

| 子專案 | 技術 |
|--------|------|
| **Tablet POS** | React 18 + TypeScript + Vite + Zustand + TanStack Query + Tailwind CSS |
| **Admin Dashboard** | React 19 + TypeScript + Vite + Chart.js + React Hook Form + Zod + Lucide Icons |

### 桌面應用 (Desktop)

| 類別 | 技術 |
|------|------|
| 框架 | Electron |
| 資料庫 | better-sqlite3 (SQLite) |
| 打包 | electron-builder (NSIS / DMG) |
| 自動更新 | electron-updater + GitHub Releases |

### 前端資料層三模式

Admin App 內建智能資料層，同一套 UI 自動適配三種資料來源：

| 模式 | 觸發條件 | 資料儲存 | 適用場景 |
|------|----------|----------|----------|
| `remote` | 設定 `VITE_DATA_MODE=remote` | Spring Boot API + PostgreSQL | 正式部署、多端協作 |
| `file` | 偵測到 `window.posApi`（Electron 環境） | SQLite（透過 Electron IPC） | 桌面應用、單機使用 |
| `local` | 預設 fallback | localStorage（瀏覽器內存） | 快速展示、開發調試 |

---

## 專案目錄結構

```
aphelion-apollo-pos/
├── src/                          # Spring Boot 後端
├── frontend/
│   ├── tablet/                   # Tablet POS 前台點餐 (React 18)
│   └── admin-app/                # Admin Dashboard 後台管理 (React 19)
├── desktop/                      # Electron 桌面應用
├── pom.xml                       # Maven 配置
├── Dockerfile                    # Docker 多階段建置
├── docker-compose.yml            # 一鍵部署（App + PostgreSQL）
├── .env.example                  # 環境變數範本
└── README.md
```

### 後端 Java 套件結構

```
src/main/java/com/breakfast/pos/
├── BreakfastPosApplication.java          # Spring Boot 啟動類
├── common/
│   └── ApiResponse.java                  # 統一 API 回應格式
├── config/
│   ├── SecurityConfig.java               # Spring Security 6 配置
│   ├── SwaggerConfig.java                # OpenAPI / Swagger 配置
│   └── DataInitializer.java              # 開發環境資料初始化
├── controller/
│   ├── AuthController.java               # POST /api/auth/login
│   ├── MenuController.java               # GET  /api/menu/**
│   ├── OrderController.java              # POST /api/orders/checkout
│   ├── AdminProductController.java       # CRUD /api/admin/products
│   ├── AdminOrderController.java         # GET|PUT /api/admin/orders
│   └── StatisticsController.java         # GET /api/admin/statistics
├── service/
│   ├── MenuService.java                  # 菜單業務邏輯
│   ├── OrderService.java                 # 訂單核心邏輯 (含幂等性保護)
│   ├── AdminOrderService.java            # 後台訂單管理
│   ├── StatisticsService.java            # 統計報表 (DB 聚合查詢)
│   ├── PrintService.java                 # 熱感應出單機 (預留)
│   └── LineService.java                  # LINE 推播通知 (預留)
├── repository/
│   ├── ProductRepository.java
│   ├── CategoryRepository.java
│   ├── OrderRepository.java              # 含 JPQL 聚合查詢
│   └── UserRepository.java
├── model/
│   ├── entity/
│   │   ├── Product.java
│   │   ├── Category.java
│   │   ├── Order.java                    # 含 idempotencyKey 唯一約束
│   │   ├── OrderItem.java
│   │   └── User.java                     # 實作 UserDetails
│   └── dto/
│       ├── ProductRequest.java / ProductResponse.java / ProductDTO.java
│       ├── CategoryResponse.java
│       ├── OrderRequest.java / OrderResponse.java / OrderItemResponse.java
│       ├── CartItemRequest.java
│       └── AuthRequest.java / AuthResponse.java
├── mapper/
│   ├── ProductMapper.java                # MapStruct Entity ↔ DTO
│   ├── CategoryMapper.java
│   └── OrderMapper.java
├── security/
│   ├── JwtTokenProvider.java             # JWT 產生與驗證
│   ├── JwtAuthenticationFilter.java      # JWT 過濾器
│   └── CustomUserDetailsService.java
└── exception/
    ├── ResourceNotFoundException.java
    └── GlobalExceptionHandler.java       # 統一異常處理 (6 種)
```

### 前端目錄結構

```
frontend/
├── tablet/                       # Tablet POS 前台點餐
│   ├── src/
│   │   ├── pages/MenuPage.tsx    # 主點餐頁面
│   │   ├── components/           # ProductCard, Cart, Button, Badge, Card
│   │   ├── hooks/                # useProducts, useCategories, usePlaceOrder
│   │   ├── stores/cartStore.ts   # Zustand 購物車狀態管理
│   │   ├── services/api.ts       # Axios API 呼叫
│   │   └── types/api.ts          # TypeScript 型別定義
│   └── package.json
│
└── admin-app/                    # Admin Dashboard 後台管理
    ├── src/
    │   ├── pages/                # Dashboard, Products, Orders, Settings
    │   ├── pos/                  # 內嵌 POS 點餐模組（共用元件）
    │   ├── components/
    │   │   ├── layout/           # Sidebar, Header, Layout
    │   │   ├── ProductModal.tsx  # 商品新增/編輯彈窗
    │   │   └── CategoryModal.tsx # 分類管理彈窗
    │   ├── services/
    │   │   ├── api.ts            # 三模式資料層 (remote/file/local)
    │   │   ├── fileDb.ts         # Electron IPC 橋接層
    │   │   └── localDb.ts        # localStorage 本地資料庫
    │   └── types/                # TypeScript 型別定義
    └── package.json
```

### 桌面應用結構

```
desktop/
├── main.js                       # Electron 主程序 (SQLite + IPC Handlers)
├── preload.js                    # 安全橋接 (contextBridge → window.posApi)
└── package.json                  # electron-builder 打包設定
```

---

## 快速開始

### 系統需求

| 工具 | 版本 | 用途 |
|------|------|------|
| Java | 21+ | 後端（推薦 Eclipse Temurin） |
| Maven | 3.8+ | 後端建構（已附 Maven Wrapper） |
| Node.js | 18+ | 前端 / 桌面應用 |
| npm | 9+ | 前端套件管理 |

### 方式一：僅啟動後端 API（零配置）

```bash
git clone <repo-url>
cd aphelion-apollo-pos

# 直接啟動（H2 內存資料庫，零配置）
./mvnw spring-boot:run        # macOS / Linux
.\mvnw.cmd spring-boot:run    # Windows
```

啟動後：
- API 伺服器：`http://localhost:8080`
- Swagger UI：`http://localhost:8080/swagger-ui.html`
- H2 Console：`http://localhost:8080/h2-console`（JDBC URL: `jdbc:h2:mem:breakfast_pos`）

### 方式二：後端 + 前端完整啟動

```bash
# 終端 1：啟動後端 API
.\mvnw.cmd spring-boot:run

# 終端 2：啟動 Tablet POS（http://localhost:5173）
cd frontend/tablet
npm install
npm run dev

# 終端 3：啟動 Admin Dashboard（http://localhost:5177）
cd frontend/admin-app
npm install
npm run dev
```

### 方式三：桌面單機版（不需要後端）

```bash
cd desktop
npm install
npm run dev
```

> 桌面版會自動使用 SQLite 本地資料庫，無需啟動 Spring Boot 後端。

### 預設帳號（網路版）

| 帳號 | 密碼 | 角色 |
|------|------|------|
| `admin` | `password` | ROLE_ADMIN |
| `staff` | `password` | ROLE_STAFF |

---

## 前端 Web 應用

### Tablet POS（前台點餐介面）

針對平板電腦與手機優化的觸控點餐介面。

| 項目 | 說明 |
|------|------|
| 路徑 | `frontend/tablet/` |
| 技術 | React 18 + Zustand + TanStack Query + Tailwind CSS |
| 預設端口 | `http://localhost:5173` |
| API 來源 | Spring Boot 後端（`VITE_API_BASE_URL`） |

**功能**：
- 左側分類導航切換
- 中央商品卡片列表（含售罄標示）
- 右側即時購物車（小計 / 總價）
- 支援內用（桌號）/ 外帶模式
- 自訂備註（Modifiers：加蛋、不加洋蔥…）

```bash
cd frontend/tablet
npm install
npm run dev       # 開發模式
npm run build     # 生產建置 → dist/
```

### Admin Dashboard（後台管理介面）

店長 / 管理員使用的完整後台管理系統。

| 項目 | 說明 |
|------|------|
| 路徑 | `frontend/admin-app/` |
| 技術 | React 19 + Chart.js + React Hook Form + Zod + TanStack Table |
| 預設端口 | `http://localhost:5177` |
| 資料模式 | 自動偵測（remote / file / local） |

**頁面**：

| 路由 | 頁面 | 功能 |
|------|------|------|
| `/` | Dashboard | 今日統計、營收趨勢圖、熱銷排行 |
| `/products` | Products | 商品 CRUD、分類管理、上下架切換 |
| `/orders` | Orders | 訂單列表、狀態更新 |
| `/settings` | Settings | 系統設定 |
| `/pos` | POS | 內嵌點餐介面（與 Tablet POS 共用元件） |

```bash
cd frontend/admin-app
npm install
npm run dev       # 開發模式
npm run build     # 生產建置 → dist/
```

---

## 桌面應用程式

Electron 封裝的單機版 POS 系統，適合無網路 / 單店環境。

| 項目 | 說明 |
|------|------|
| 路徑 | `desktop/` |
| 技術 | Electron + better-sqlite3 + electron-updater |
| 內嵌 UI | `frontend/admin-app`（自動打包） |
| 資料庫 | SQLite（存放於使用者資料目錄） |
| 打包格式 | Windows: `.exe` (NSIS) / macOS: `.dmg` |
| 自動更新 | 靜默下載，關閉時自動安裝（透過 GitHub Releases） |

### 運作原理

1. Electron 主程序（`main.js`）啟動時初始化 SQLite 資料庫
2. 透過 `preload.js` 安全地將 `window.posApi` 暴露給前端
3. Admin App 偵測到 `window.posApi` 存在 → 自動切換為 `file` 模式
4. 所有資料操作透過 Electron IPC（`ipcRenderer.invoke`）→ SQLite

### 開發與打包

```bash
cd desktop
npm install

# 開發模式（需先建置 admin-app）
npm run build:ui    # 建置前端
npm run dev         # 啟動 Electron

# 打包（本地使用）
npm run pack:win    # 打包 Windows .exe
npm run pack:mac    # 打包 macOS .dmg
npm run pack:all    # 打包全平台

# 打包 + 發布到 GitHub Releases（需設定 GH_TOKEN）
GH_TOKEN=xxx npm run publish:win
GH_TOKEN=xxx npm run publish:mac
GH_TOKEN=xxx npm run publish:all
```

### 遠端自動更新

桌面應用內建 **靜默自動更新** 機制，透過 GitHub Releases 發布新版本後，客戶端會自動完成更新。

**更新流程**：

```
應用啟動 → 延遲 10 秒 → 檢查 GitHub Releases 最新版本
  ├── 有新版本 → 背景靜默下載 → 使用者關閉應用時自動安裝
  └── 已是最新 → 無動作（每 4 小時重新檢查）
```

**發布新版本的步驟**：

```bash
# 1. 更新版本號
# 修改 desktop/package.json 的 "version" 欄位（如 0.1.0 → 0.2.0）

# 2. 打包並發布到 GitHub Releases
cd desktop
GH_TOKEN=your_github_token npm run publish:win    # Windows
GH_TOKEN=your_github_token npm run publish:mac    # macOS
GH_TOKEN=your_github_token npm run publish:all    # 全平台

# 3. 完成！客戶端下次啟動後會自動偵測並更新
```

> **注意**：`GH_TOKEN` 是 GitHub Personal Access Token（需要 `repo` 權限），僅發布端需要。客戶端檢查公開 Release 不需要 token。

**前端 API（供 Settings 頁面使用）**：

```javascript
// 查詢更新狀態
const status = await window.posApi.updater.getStatus();
// { state: 'downloaded', currentVersion: '0.1.0', version: '0.2.0', progress: 100 }

// 手動觸發檢查
await window.posApi.updater.checkNow();
```

### 網路版 vs 單機版對比

| 比較項目 | 網路版 | 單機版 |
|---------|--------|--------|
| 部署方式 | 伺服器 / Docker / 雲端 | 安裝 .exe / .dmg |
| 資料庫 | PostgreSQL | SQLite（本地檔案） |
| 多設備存取 | 支援（任意瀏覽器） | 僅限安裝設備 |
| 需要網路 | 是 | 否 |
| 認證授權 | JWT + RBAC | 無（本地單用戶） |
| 適合場景 | 多門市、多設備協作 | 單店、攤販、展示 |
| 資料同步 | 即時（共用 DB） | 無（本地獨立） |

---

## 環境配置

### Profile 切換

| Profile | 資料庫 | 用途 |
|---------|--------|------|
| `dev`（預設） | H2 內存資料庫 | 本地開發，零配置 |
| `prod` | PostgreSQL | 正式部署 |

### 環境變數（生產環境必填）

參考 `.env.example`：

| 變數 | 說明 | 範例 |
|------|------|------|
| `DB_URL` | PostgreSQL 連線字串 | `jdbc:postgresql://localhost:5432/breakfast_pos` |
| `DB_USERNAME` | 資料庫帳號 | `postgres` |
| `DB_PASSWORD` | 資料庫密碼 | `your_secure_password` |
| `JWT_SECRET` | JWT 簽章密鑰（≥32 字元） | `a-random-secure-string-...` |
| `CORS_ALLOWED_ORIGINS` | CORS 白名單（逗號分隔） | `https://your-domain.com` |

---

## API 文件

### 公開端點（無需認證）

| 方法 | 路徑 | 說明 |
|------|------|------|
| `POST` | `/api/auth/login` | 登入取得 JWT |
| `GET` | `/api/menu/products` | 查詢所有商品 |
| `GET` | `/api/menu/categories` | 查詢所有分類 |
| `GET` | `/api/menu/products/{id}` | 查詢商品詳情 |
| `POST` | `/api/orders/checkout` | 結帳下單 |

### 管理端點（需 ADMIN 角色 + JWT）

| 方法 | 路徑 | 說明 |
|------|------|------|
| `GET` | `/api/admin/products` | 商品列表（管理） |
| `POST` | `/api/admin/products` | 新增商品 |
| `PUT` | `/api/admin/products/{id}` | 更新商品 |
| `PATCH` | `/api/admin/products/{id}/toggle` | 切換商品上下架 |
| `DELETE` | `/api/admin/products/{id}` | 刪除商品 |
| `GET` | `/api/admin/orders?page=0&size=20` | 訂單列表（分頁） |
| `GET` | `/api/admin/orders/{id}` | 訂單詳情 |
| `PUT` | `/api/admin/orders/{id}/status` | 更新訂單狀態 |
| `GET` | `/api/admin/statistics/today` | 今日統計 |
| `GET` | `/api/admin/statistics/revenue?days=7` | 營收趨勢 |
| `GET` | `/api/admin/statistics/top-products?limit=5` | 熱銷排行 |

### 認證方式

```bash
# 1. 登入
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# 2. 攜帶 JWT 存取 Admin API
curl http://localhost:8080/api/admin/products \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 資料庫

### 實體關係

```
Category 1 ──── N Product
Order    1 ──── N OrderItem N ──── 1 Product
User (獨立)
```

### Flyway 遷移腳本

| 版本 | 檔案 | 說明 |
|------|------|------|
| V1 | `V1__init_schema.sql` | 建立 categories、products、orders、order_items 表 + 索引 |
| V2 | `V2__seed_data.sql` | 插入 4 分類 + 13 示範商品 |
| V3 | `V3__create_users_table.sql` | 建立 users 表（RBAC） |
| V4 | `V4__seed_users.sql` | 插入 admin / staff 預設帳號 |
| V5 | `V5__add_idempotency_key_to_orders.sql` | 訂單幂等性欄位 |

### 訂單狀態流轉

```
PENDING → PREPARING → SERVED → COMPLETED
                              ↘ CANCELLED
```

---

## 測試

```bash
# 執行所有測試
./mvnw test

# 產生覆蓋率報告
./mvnw test jacoco:report
# 報告位置：target/site/jacoco/index.html
```

### 測試清單（共 19 個測試）

| 測試類別 | 類別 | 數量 | 說明 |
|---------|------|------|------|
| `MenuServiceTest` | 單元 | 5 | 商品 CRUD、分類、上下架切換 |
| `OrderServiceTest` | 單元 | 3 | 下單成功、商品售罄、商品不存在 |
| `MenuControllerTest` | 整合 | 4 | 菜單 API 回應格式驗證 |
| `AuthControllerTest` | 整合 | 3 | 登入成功、密碼錯誤、參數驗證 |
| `AdminProductControllerTest` | 整合 | 4 | RBAC 權限 (未認證/STAFF/ADMIN)、驗證 |

---

## Docker 部署

### 使用 Docker Compose（推薦）

```bash
# 1. 建立環境變數檔
cp .env.example .env
# 編輯 .env 設定正式密碼和 JWT Secret

# 2. 一鍵啟動（App + PostgreSQL）
docker compose up -d

# 3. 查看日誌
docker compose logs -f app

# 4. 停止服務
docker compose down
```

### 單獨建置映像

```bash
docker build -t breakfast-pos .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:postgresql://host:5432/breakfast_pos \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=secret \
  -e JWT_SECRET=your-secret-key \
  breakfast-pos
```

---

## 架構改進紀錄

以下為本次架構審查後實施的改進，按優先級排序：

### P1：Spring Boot 2.7 → 3.2.5 升級

| 項目 | 變更 |
|------|------|
| Spring Boot | 2.7.18 → **3.2.5** |
| 命名空間 | `javax.*` → `jakarta.*`（14 個檔案） |
| Security Config | 遷移至 Spring Security 6 Lambda DSL |
| 方法安全 | `@EnableGlobalMethodSecurity` → `@EnableMethodSecurity` |
| OpenAPI | `springdoc-openapi-ui:1.6` → `springdoc-openapi-starter-webmvc-ui:2.3` |

### P2：安全加固

- JWT Secret **移除硬編碼預設值**，強制透過環境變數或配置注入
- CORS 支援白名單模式（`app.cors.allowed-origins`），生產環境不再全開
- 生產環境 **關閉 Swagger UI**
- 資料庫帳密改用 **環境變數** (`${DB_USERNAME}`, `${DB_PASSWORD}`)
- 新增 `.env.example` 環境變數範本

### P3：StatisticsController 重構

- 新建 `StatisticsService` 封裝業務邏輯，Controller 不再直接存取 Repository
- `OrderRepository` 新增 **JPQL 聚合查詢**（`SUM`, `COUNT`），消除 `findAll()` 全表掃描
- `AdminOrderController` 同步重構，新增 `AdminOrderService`
- `ProductRepository` 新增 `countByAvailableFalse()`

### P4：GlobalExceptionHandler 完善

新增異常處理（原先僅 2 種，現在 6 種）：

| 異常 | HTTP 狀態碼 |
|------|------------|
| `ResourceNotFoundException` | 404 Not Found |
| `MethodArgumentNotValidException` | 400 Bad Request（含欄位驗證訊息） |
| `IllegalArgumentException` | 400 Bad Request |
| `IllegalStateException` | 409 Conflict |
| `AuthenticationException` | 401 Unauthorized |
| `AccessDeniedException` | 403 Forbidden |
| 通用 `Exception` | 500（不再洩漏內部訊息） |

### P5：測試覆蓋率提升

- 新增 3 個 Controller 整合測試類（`@SpringBootTest` + `MockMvc`）
- 含 RBAC 權限測試（`@WithMockUser`）
- 測試總數 **8 → 19**

### P6：Docker 容器化

- 多階段建置 `Dockerfile`（build + runtime 分離，非 root 使用者執行）
- `docker-compose.yml`（App + PostgreSQL 一鍵啟動，含健康檢查）

### P7：訂單幂等性 + 依賴清理

- `OrderRequest` 新增 `idempotencyKey` 欄位，防止重複下單
- `Order` 實體新增唯一約束 + Flyway V5 遷移腳本
- **移除未使用的** `spring-boot-starter-data-redis` 和 `spring-kafka` 依賴

### P8：Electron 遠端自動更新

- 安裝 `electron-updater` 依賴
- 新增 `desktop/updater.js` 自動更新模組：啟動後延遲 10 秒檢查、每 4 小時定時檢查、靜默下載、關閉時自動安裝
- `desktop/main.js` 整合 updater 初始化 + 新增 `updater:getStatus` / `updater:checkNow` IPC handler
- `desktop/preload.js` 暴露 `window.posApi.updater` API 供前端查詢更新狀態
- `desktop/package.json` 新增 `publish` 配置（GitHub Releases）、NSIS 安裝選項、`publish:win/mac/all` 腳本

---

## 授權

本專案僅供學習與內部使用。
