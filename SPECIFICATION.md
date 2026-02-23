# 早餐店 POS 系統需求規格書 (Requirement Specification)

## 1. 專案概述 Project Overview
本專案旨在為早餐店打造一套現代化、流暢且易於操作的 POS (Point of Interaction) 系統。考量到門市作業節奏快、工作環境多變，系統優先針對 **平板電腦 (Tablet)** 與 **智慧型手機 (Mobile)** 進行優化。

### 1.1 目標 Goal

*   **高效點餐**：縮短結帳與轉送廚房的時間。
*   **精美視覺**：採用 Glassmorphism 設計，提升品牌專業感與操作愉悅度。
*   **高擴展性**：後端基於 Java 21 / Spring Boot 2.7.2 構建，便於未來功能迭代。

---

## 2. 功能需求 Functional Requirements

### 2.1 菜單管理 (Menu Management)
*   **分類瀏覽**：支援左側分類切換 (如：漢堡、蛋餅、飲品、吐司)。
*   **商品展示**：支援商品圖片、名稱、價格顯示。
*   **自定義選項 (Modifiers)**：支援加蛋、不加洋蔥、大冰奶去冰等細節備註。
*   **庫存狀態**：即時顯示商品是否售罄 (Available/Out of stock)。

### 2.2 點餐與訂單 (Ordering & Cart)
*   **即時購物車**：在右側即時彙整當前勾選項目，計算小計與總價。
*   **取餐模式**：支援「內用 (Dine-in)」與「外帶 (Takeaway)」。
*   **桌號管理**：內用模式下可輸入/選擇桌號。
*   **訂單暫存**：支援先點餐、後結帳的功能。

### 2.3 出單與列印 (Printing Support)
*   **自動出單**：下單完成後自動發送指令至熱感應出單機。
*   **廚房單 (KOT)**：僅列印餐點內容、桌號與備註，供廚房製作。
*   **顧客收據**：列印詳細清單、總額與交易序號。
*   **標籤列印**：支援飲品或漢堡包裝標籤（選配）。

### 2.4 訂單狀態追蹤 (Order Tracking)
*   **狀態流轉**：`PENDING (待處理)` -> `PREPARING (製作中)` -> `SERVED (已出餐)` -> `COMPLETED (已完成)`。
*   **廚房看板功能**：提供基礎的 API 供未來擴充廚房平板顯示功能。

### 2.5 LINE 遠端點餐 (LINE Messaging API Integration)
*   **線上點餐**：顧客可透過門市 LINE 官方帳號進行遠端點餐。
*   **推播通知**：當店員確認訂單或餐點完成時，自動發送 LINE 訊息通知顧客。
*   **會員綁定**：整合 LINE Profile，自動識別常客。

### 2.6 後台管理系統 (Back-end Management / Admin)
*   **菜單維護**：即時新增、修改商品價格、圖片與描述，控制商品上下架。
*   **各類統計報表**：
    *   **銷售分析**：每日/每週營收趨勢圖。
    *   **排行統計**：熱銷單品排行榜、尖峰時段分析。
*   **訂單紀錄查詢**：查看歷史訂單、處理退款或補印收據。
*   **系統設定**：LINE Webhook 設定、出單機 IP 連結設定。

### 2.7 報表與統計 (Reporting - Phase 2)
*   **日結統計**：每日營業額、最暢銷單品排行。

---

## 3. 技術規格 Technical Stack

### 3.1 後端架構 (Backend)
*   **語言**：Java 21 (使用 Record, Pattern Matching, Stream API)。
*   **框架**：Spring Boot 2.7.2。
*   **安全性**：使用 `Optional<T>` 嚴格執行 Null-safety。
*   **異常處理**：統一使用 `@RestControllerAdvice` 進行攔截。
*   **API 格式**：統一使用 `ApiResponse<T>` 包裝。
*   **資料庫**：Spring Data JPA。

### 3.2 介面設計 (UI/UX)
*   **設計風格**：Premium Modern (Glassmorphism)。
*   **響應式佈局**：支援 iPad, Android Tablet 以及 iPhone/Android 手機螢幕。
*   **配色方案**：深色模式 (Dark Mode) 或 溫暖晨曦感配色，並搭配高對比圖片。

### 3.3 出單技術 (Printing Technology)
*   **通訊協議**：支援 **ESC/POS** 標準指令集。
*   **連線方式**：支援網絡列印 (TCP/IP Port 9100) 與藍牙連線。
*   **列印引擎**：後端預留 `PrintService` 介面，支援動態格式化模板。

### 3.4 第三方整合 (Third-party Integration)

*   **LINE Messaging API**：預留 Webhook 接口接收點餐訊息。
*   **LIFF (LINE Front-end Framework)**：專為顧客端設計的微型 Web App 點餐介面。

### 3.5 安全與權限 (Security & Authorization)

*   **RBAC (Role-Based Access Control)**：區分 `ADMIN` (店長) 與 `STAFF` (店員)。
*   **Spring Security 整合**：後台管理介面需經過 JWT 或 Session 認證。

### 3.6 API 文件服務 (API Documentation)

*   **OpenAPI 3 / Swagger UI**：所有對外接口需具備動態文檔與測試頁面，路徑預設為 `/swagger-ui.html`。

---

## 4. 驗收標準 Acceptance Criteria (AC)

### 4.1 核心結帳流程
*   **AC1**：系統應能根據購物車品項正確計算總額。
*   **AC2**：結帳後訂單狀態應自動變更為 `PREPARING`。
*   **AC3**：成功存檔後，系統必須觸發 `PrintService` 發送資料至出單機。

### 4.2 菜單維護流程
*   **AC1**：管理員應能透過 API 修改商品單價，前台應即時反映新價格。
*   **AC2**：刪除商品時，若該商品已有歷史訂單，應採用邏輯刪除 (Soft Delete/Toggle Available) 而非物理刪除。

---

## 5. 資料模型 Data Model (ERD Concept)

### 4.1 核心實體
*   **Product** (商品)：`id`, `name`, `price`, `description`, `category_id`, `is_available`
*   **Category** (分類)：`id`, `name`
*   **Order** (訂單)：`id`, `status`, `type`, `table_number`, `total_amount`, `created_at`
*   **OrderItem** (項次)：`id`, `order_id`, `product_id`, `quantity`, `modifiers`, `subtotal`

---

## 5. 介面原型預覽 (UI Prototype)
系統介面應具備側邊分類導航、中央商品列表與右側購物車清單，並使用高品質陰影與柔焦背景。

---

## 6. 非功能需求 Non-Functional Requirements
*   **效能**：API 回應時間應小於 200ms。
*   **易用性**：店員在尖峰時段應能單手完成 80% 的常用操作。
*   **穩定性**：支援斷網緩存（前端本地暫存數據，待連線後同步）。
