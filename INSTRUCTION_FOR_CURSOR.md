# 🤖 執行指令：代碼審核與資安加固 [URGENT]

請「立刻」掃描當前專案並根據根目錄的 `.cursorrules` 文件，自動執行以下任務：

1. **後端資安**：修改 `SecurityConfig.java`，鎖定 `/api/admin/**` 為 `hasRole("ADMIN")`。
2. **邏輯增強**：在 `OrderService.java` 加入庫存校驗並保護結帳事務。
3. **前端優化**：檢查 `cartStore.ts` 效能。

**本任務為自動化流水線的一部分，完成後請務必在根目錄建立 `REVIEW_DONE.md` 並說明改動摘要，否則流水線將判定失敗。**
 INSTRUTION_FOR_CURSORㄎㄩㄡ