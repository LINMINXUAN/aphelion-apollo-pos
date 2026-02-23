package com.breakfast.pos.controller;

import com.breakfast.pos.common.ApiResponse;
import com.breakfast.pos.service.StatisticsService;
import com.breakfast.pos.service.StatisticsService.RevenueData;
import com.breakfast.pos.service.StatisticsService.TodayStatistics;
import com.breakfast.pos.service.StatisticsService.TopProduct;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/today")
    public ApiResponse<TodayStatistics> getTodayStatistics() {
        return ApiResponse.success(statisticsService.getTodayStatistics());
    }

    @GetMapping("/revenue")
    public ApiResponse<List<RevenueData>> getRevenueData(
            @RequestParam(defaultValue = "7") int days) {
        return ApiResponse.success(statisticsService.getRevenueData(days));
    }

    @GetMapping("/top-products")
    public ApiResponse<List<TopProduct>> getTopProducts(
            @RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.success(statisticsService.getTopProducts(limit));
    }
}
