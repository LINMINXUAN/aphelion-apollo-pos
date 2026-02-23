# REVIEW DONE

已完成審查與加固任務：

1. 後端資安
- 已更新 `SecurityConfig.java`，將 `/api/admin/**` 權限改為 `hasRole("ADMIN")`。

2. 訂單邏輯強健化
- 已在 `OrderService.java` 的 `placeOrder` 加入 `validateOrderRequest`：
  - 訂單項目不可為空
  - 數量需大於 0
- 既有商品可售性檢查（`available == false` 拋錯）已保留於 `createOrderItem`。
- 副作用（列印、LINE 通知）維持以 `try-catch` 包覆，不影響結帳主交易提交。

3. 前端效能優化
- 已優化 `frontend/tablet/src/stores/cartStore.ts` 與 `frontend/admin-app/src/pos/stores/cartStore.ts`：
  - `addItem` 改為索引更新，避免高頻點擊下 map 全量迭代
  - `updateQuantity` 合併單次 set，移除 nested set 呼叫
  - 同數量更新時回傳原 item，降低不必要重繪

  