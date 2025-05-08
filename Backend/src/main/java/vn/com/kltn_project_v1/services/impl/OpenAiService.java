package vn.com.kltn_project_v1.services.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import lombok.RequiredArgsConstructor;
import vn.com.kltn_project_v1.services.IOpenAi;

import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class OpenAiService implements IOpenAi {
    @Value("${openai.api.key}")
    private String OPENAI_API_KEY;

    private final WebClient webClient;

    public String extractIntentAndEntities(String message)  {
        String prompt = """
        Bạn là trợ lý AI giúp đặt phòng họp nội bộ. 
        Người dùng nhắn: "%s"
        Bạn cần phân tích câu nhắn của người dùng và xác định ý định (intent) và các thực thể (entities) trong câu nhắn đó.
        Các ý định (intent) có thể là:
        Trả về JSON gồm: intent (ví dụ: "book_reservation", "check_schedule","cancel_reservation","update_reservation",info_reservation","software_function" và "other")
        và các entity như "date", "reservation", "room","requestForm"  nếu có.
        ví dụ Json trả về, bạn lấy thông tin phân tích ở trên để thêm vào những thuộc tinhs trong entity chứ không phải lấy dưới ví dụ
        {
            "intent": "book_reservation",
            "entities": {
                "time": "2025-03-22T08:00:00.000Z",
                "room": "room1",
                "location": "chi nhanh A, tòa nhà A,tầng 1",
                "capacity": "10",
                "typeRoom":"default",
        }
        {
            "intent": "check_schedule",
            "entities": {
             "time": "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
        }
        {
            "intent": "cancel_reservation",
            "entities": {
               "reservation_title": "Họp nội bộ",
               "time": "2025-03-22T08:00:00.000Z",
                "room": "room1",
        }
        {
            "intent": "update_reservation",
            "entities": {
                "reservation_title": "Họp nội bộ",
                "time": "2025-03-22T08:00:00.000Z",
                "room": "room1",
                "new_time": "2025-03-22T09:00:00.000Z",
                "new_service": "Dịch vụ A",
                "attendee": "Nguyễn Văn A, Nguyễn Văn B",
        }
        {
            "intent": "info_reservation",
            "entities": {
                "reservation_title": "Họp nội bộ",
                "time": "2025-03-22T08:00:00.000Z",
                "room": "room1",
        }
        {
            "intent": "software_function",
            "entities": {
                "function_name": "",
        }
        {
            "intent": "other",
            "entities": {
                ""
        }
        ví dụ :
        người dùng hỏi "xem lịch họp ngày hôm nay"
        bạn phải xem thử ngày hôm nay là ngày nào rồi trả về json như sau:
        {
            "intent": "check_schedule",
            "entities": {
                "time": "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", format date ở đây là của ngày hôm nay 
        }
        là dựa theo mẫu trên để trả về JSON chứ không phải là lấy mẫu trên rồi trả về JSON.
        Các intent có thể là:
        "book_reservation" là đặt phòng
        "check_schedule" là kiểm tra lịch
        "cancel_reservation" là hủy đặt phòng
        "update_reservation" là cập nhật đặt phòng
        "info_reservation" là thông tin đặt phòng
        rồi các thông tin người dùng cung cấp thế vào mẫu để trả vào json để tôi gọi api
        software_function là các phần của phan mem nay vi du nhu: update_reservation chỉ có thể cập nhập thành viên, diịch vụ, tiêu đề, tài liệu thôi, hoặc laf thời gian đặt sẽ cách nhau 10p.
        "other" là các câu hỏi không liên quan đến phần mềm này.
        Nếu không có entity nào thì trả về null
        Nếu không có intent nào thì trả về null
        neeus null thi hoi lai người dùng
    """.formatted(message);

        // Gọi API OpenAI
        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.2
        );

        return webClient.post()
                .uri("/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block(); // Chặn luồng lấy kết quả (nếu muốn async có thể dùng .subscribe() hoặc return Mono)
    }

}
