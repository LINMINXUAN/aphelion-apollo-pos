package com.breakfast.pos.service;

import com.breakfast.pos.model.entity.Order;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 預留 LINE Messaging API 整合服務
 */
@Service
@Slf4j
public class LineService {

    /**
     * 發送點餐進度通知給顧客
     * 
     * @param lineUserId  顧客的 LINE ID
     * @param messageBean 通知內容
     */
    public void sendPushNotification(String lineUserId, String messageBean) {
        log.info("Preparing to send LINE notification to {}: {}", lineUserId, messageBean);
        // TODO: 使用 LINE SDK 發送 Push Message
        // LineMessagingClient client =
        // LineMessagingClient.builder(channelToken).build();
        // client.pushMessage(new PushMessage(lineUserId, new
        // TextMessage(messageBean)));
    }

    /**
     * 當訂單狀態變更時，觸發 LINE 通知
     */
    public void notifyOrderStatusChange(Order order) {
        // 假設訂單實體未來會擴充 lineUserId 欄位
        String mockLineUserId = "U1234567890abcdef";
        String statusMessage = switch (order.getStatus()) {
            case PREPARING -> "🍕 您的餐點正在製作中！";
            case SERVED -> "🛎️ 餐點已準備好，請至櫃檯取餐！";
            case COMPLETED -> "✨ 感謝您的光臨，祝您有美好的一天！";
            default -> null;
        };

        if (statusMessage != null) {
            sendPushNotification(mockLineUserId, statusMessage);
        }
    }
}
