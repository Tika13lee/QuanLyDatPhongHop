package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import vn.com.kltn_project_v1.dtos.statistical.DataStatisticalDTO;
import vn.com.kltn_project_v1.repositories.ReservationRepository;
import vn.com.kltn_project_v1.services.IStatistical;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@org.springframework.stereotype.Service
public class StatisticalService implements IStatistical {
    private final ReservationRepository reservationRepository;
    @Override
    public List<DataStatisticalDTO> getStatisticalService(Date startDate, Date endDate) {
        List<Object[]> services = reservationRepository.statisticalService(startDate, endDate);

        // Bước 1: Convert sang Map và sort giảm dần theo số lượng
        Map<String, Integer> allServices = services.stream()
                .collect(Collectors.toMap(
                        s -> (String) s[0],
                        s -> ((Number) s[1]).intValue(),
                        Integer::sum
                ));

        // Bước 2: Lấy 5 service đầu tiên
        Map<String, Integer> top5 = allServices.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> a,
                        LinkedHashMap::new // giữ thứ tự
                ));

        // Bước 3: Gộp các service còn lại thành "Khác"
        int otherTotal = allServices.entrySet().stream()
                .filter(entry -> !top5.containsKey(entry.getKey()))
                .mapToInt(Map.Entry::getValue)
                .sum();

        if (otherTotal > 0) {
            top5.put("Khác", otherTotal);
        }
        // Bước 4: Chuyển đổi sang List<DataStatisticalDTO>
        return top5.entrySet().stream()
                .map(entry -> new DataStatisticalDTO(
                        entry.getKey(), // tên dịch vụ
                        0, // số lượng
                        0, // tổng tiền (không có thông tin này trong kết quả)
                        0, // số lượng phòng (không có thông tin này trong kết quả)
                        entry.getValue()
                ))
                .collect(Collectors.toList());


    }

    @Override
    public List<DataStatisticalDTO> getBranchData(Date startDate, Date endDate) {
        List<Object[]> branchData = reservationRepository.statisticalBranchData(startDate, endDate);
        return branchData.stream()
                .map(data -> new DataStatisticalDTO(
                        (String) data[0], // tên chi nhánh
                        ((Number) data[2]).intValue(), // số lượng đặt phòng
                        ((Number) data[1]).intValue(), // tổng tiền
                        ((Number) data[3]).intValue(), // số lượng phòng
                        0 // số lượng dịch vụ (không có thông tin này trong kết quả)
                ))
                .collect(Collectors.toList());
    }
    @Override
    public List<DataStatisticalDTO> statisticalDaily(Date startDate, Date endDate) {
        List<Object[]> dailyData = reservationRepository.statisticalDaily(startDate, endDate);
        return dailyData.stream()
                .map(data -> new DataStatisticalDTO(
                        ( data[0].toString()), // ngày
                        ((Number) data[2]).intValue(), // số lượng đặt phòng
                        ((Number) data[1]).intValue() // tổng tiền
                ))
                .collect(Collectors.toList());
    }
    @Override
    public List<DataStatisticalDTO> statisticalRoom(Date startDate, Date endDate) {
        List<Object[]> roomData = reservationRepository.statisticalRoom(startDate, endDate);
        return roomData.stream()
                .map(data -> new DataStatisticalDTO(
                        (String) data[0], // tên phòng
                        ((Number) data[2]).intValue(), // số lượng đặt phòng
                        ((Number) data[1]).intValue() // tổng tiền
                ))
                .collect(Collectors.toList());
    }
    @Override
    public List<Map<String, Object>> statisticalChart24h(Date dayStart, Date dayEnd) {
        List<Object[]> result = reservationRepository.fullStatistical(dayStart, dayEnd);

        // Khởi tạo map theo phút trong 24h
        Map<String, Map<String, Object>> fullMap = new LinkedHashMap<>();

        // Gán dữ liệu có thật vào map
        for (Object[] row : result) {
            int hour = (int) row[0];
            int minute = (int) row[1];
            long count = ((Number) row[2]).longValue();
            long total = ((Number) row[3]).longValue();

            String key = String.format("%02d:%02d", hour, minute);
            fullMap.put(key, Map.of(
                    "time", key,
                    "count", count,
                    "total", total
            ));
        }

        return new ArrayList<>(fullMap.values());
    }

}
