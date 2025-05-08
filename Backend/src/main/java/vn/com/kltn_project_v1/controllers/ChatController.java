package vn.com.kltn_project_v1.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.repositories.ReservationRepository;
import vn.com.kltn_project_v1.services.IOpenAi;

import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private IOpenAi openAiService;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/botChat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String aiResponse = openAiService.extractIntentAndEntities(message);
        System.out.println("AI Response: " + aiResponse);

        try {
            JsonNode rootNode = objectMapper.readTree(aiResponse);
            JsonNode choicesNode = rootNode.get("choices");
            if (choicesNode != null && choicesNode.isArray() && choicesNode.size() > 0) {
                JsonNode messageNode = choicesNode.get(0).get("message");
                if (messageNode != null) {
                    String content = messageNode.get("content").asText();
                    System.out.println("Content: " + content);
                    try {
                        Map<String, Object> contentMap = objectMapper.readValue(content, Map.class);
                        String intent = (String) contentMap.get("intent");
                        Map<String, Object> entities = (Map<String, Object>) contentMap.get("entities");

                        System.out.println("Intent: " + intent);
                        System.out.println("Entities: " + entities);

                        String reply = processIntentAndEntities(intent, entities);
                        return ResponseEntity.ok(Map.of("reply", reply));

                    } catch (Exception e) {
                        System.err.println("Error parsing content JSON: " + e.getMessage());
                        return ResponseEntity.badRequest().body(Map.of("error", "Không thể parse JSON nội dung từ AI."));
                    }
                }
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy thông tin phản hồi hợp lệ từ AI."));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể xử lý phản hồi từ AI."));
        }
    }

    private Date parseTimeStringToDate(String timeString) {
        try {
            // Thử parse theo định dạng có timezone (ví dụ: 2025-03-22T00:00:00.000Z)
            OffsetDateTime offsetDateTime = OffsetDateTime.parse(timeString);
            return Date.from(offsetDateTime.toInstant());
        } catch (Exception e1) {
            try {
                // Thử parse theo định dạng khác nếu cần (ví dụ: không có timezone)
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
                return sdf.parse(timeString);
            } catch (Exception e2) {
                try {
                    SimpleDateFormat sdfWithoutMillis = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                    return sdfWithoutMillis.parse(timeString);
                } catch (Exception e3) {
                    throw new IllegalArgumentException("Không thể parse chuỗi thời gian: " + timeString, e3);
                }
            }
        }
    }

    private String processIntentAndEntities(String intent, Map<String, Object> entities) {
        if ("check_schedule".equals(intent)) {
            // Lấy thông tin thời gian từ entities
            String timeString = (String) entities.get("time");
            Date time = parseTimeStringToDate(timeString);
            String scheduleInfo = getScheduleForTime(time);

            return scheduleInfo;
        } else if ("book_reservation".equals(intent)) {
            // Lấy thông tin đặt phòng từ entities và gọi API đặt phòng của bạn
            // ...
            return "Đã thực hiện đặt phòng thành công.";
        } else if ("cancel_reservation".equals(intent)) {
            // Lấy thông tin hủy đặt phòng từ entities và gọi API hủy đặt phòng của bạn
            // ...
            return "Đã hủy đặt phòng thành công.";
        } else if ("update_reservation".equals(intent)) {
            // Lấy thông tin cập nhật đặt phòng từ entities và gọi API cập nhật đặt phòng của bạn
            // ...
            return "Đã cập nhật đặt phòng thành công.";
        } else if ("info_reservation".equals(intent)) {
            // Lấy thông tin chi tiết đặt phòng từ entities và gọi API lấy thông tin đặt phòng của bạn
            // ...
            return "Thông tin đặt phòng của bạn: ...";
        } else if ("software_function".equals(intent)) {
            String functionName = (String) entities.get("function_name");
            // Xử lý các chức năng phần mềm dựa trên functionName
            return "Thực hiện chức năng: " + functionName;
        } else if ("other".equals(intent)) {
            return "Tôi xin lỗi, tôi không hiểu yêu cầu này.";
        } else if (intent == null) {
            return "Xin vui lòng hỏi lại rõ hơn.";
        }
        return "Tôi không chắc bạn muốn gì.";
    }

    private String getScheduleForTime(Date time) {
        List<Reservation> reservations = reservationRepository.findReservationsInDay(time);
        if (reservations != null && !reservations.isEmpty()) {
            StringBuilder scheduleInfo = new StringBuilder();
            for (Reservation reservation : reservations) {
                scheduleInfo.append("Phòng: ").append(reservation.getRoom().getRoomName())
                        .append(", Thời gian bắt đầu: ").append(reservation.getTimeStart())
                        .append(", Thời gian kết thúc: ").append(reservation.getTimeEnd())
                        .append("---------------------------------------------");
            }
            return scheduleInfo.toString();
        }
        return "Chưa có thông tin lịch trình.";
    }
}
