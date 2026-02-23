package com.breakfast.pos.service;

import com.breakfast.pos.repository.OrderRepository;
import com.breakfast.pos.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public TodayStatistics getTodayStatistics() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        BigDecimal todayRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(startOfDay, endOfDay);
        long todayOrders = orderRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        long totalProducts = productRepository.count();
        long unavailableCount = productRepository.countByAvailableFalse();

        return new TodayStatistics(
                todayRevenue.doubleValue(),
                (int) todayOrders,
                (int) totalProducts,
                (int) unavailableCount);
    }

    @Transactional(readOnly = true)
    public List<RevenueData> getRevenueData(int days) {
        List<RevenueData> revenueList = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1);

            BigDecimal dayRevenue = orderRepository.sumTotalAmountByCreatedAtBetween(startOfDay, endOfDay);
            revenueList.add(new RevenueData(date.toString(), dayRevenue.doubleValue()));
        }

        return revenueList;
    }

    @Transactional(readOnly = true)
    public List<TopProduct> getTopProducts(int limit) {
        return orderRepository.findTopSellingProducts().stream()
                .limit(limit)
                .map(row -> new TopProduct(
                        (String) row[0],
                        ((Number) row[1]).intValue(),
                        ((Number) row[2]).doubleValue()))
                .toList();
    }

    public record TodayStatistics(double todayRevenue, int todayOrders, int totalProducts, int lowStockCount) {}
    public record RevenueData(String date, double revenue) {}
    public record TopProduct(String productName, int totalSold, double totalRevenue) {}
}
