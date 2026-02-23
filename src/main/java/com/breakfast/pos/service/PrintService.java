package com.breakfast.pos.service;

import com.breakfast.pos.model.entity.Order;
import com.breakfast.pos.model.entity.OrderItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 處理熱感應出單機 (Thermal Printer) 列印邏輯
 */
@Service
@Slf4j
public class PrintService {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 模擬列印流程。在實際生產環境中，這裡會透過 Socket (TCP 9100)
     * 或藍牙發送 ESC/POS 指令集。
     */
    public void printReceipt(Order order) {
        String receipt = formatReceipt(order);

        log.info("Sending to Printer -> \n{}", receipt);

        // TODO: Socket socket = new Socket(printerIp, 9100);
        // TODO: socket.getOutputStream().write(escPosCommands);
    }

    private String formatReceipt(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("================================\n");
        sb.append("      SUNRISE BITES POS         \n");
        sb.append("================================\n");
        sb.append("單號: ").append(order.getId()).append("\n");
        sb.append("日期: ").append(order.getCreatedAt().format(TIME_FORMATTER)).append("\n");
        sb.append("類型: ").append(order.getType()).append("\n");

        if (order.getTableNumber() != null) {
            sb.append("桌號: ").append(order.getTableNumber()).append("\n");
        }

        sb.append("--------------------------------\n");

        order.getItems().forEach(item -> {
            sb.append(String.format("%-15s x%d  $%s\n",
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getSubtotal()));

            if (item.getModifiers() != null && !item.getModifiers().isEmpty()) {
                sb.append("  * ").append(item.getModifiers()).append("\n");
            }
        });

        sb.append("--------------------------------\n");
        sb.append("總計: $").append(order.getTotalAmount()).append("\n");
        sb.append("================================\n");
        sb.append("      謝謝惠顧，祝您早安!       \n");
        sb.append("================================\n");

        return sb.toString();
    }
}
