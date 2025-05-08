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
        Trả về JSON gồm: intent (ví dụ: "book_reservation", "check_schedule","cancel_reservation","update_reservation",info_reservation","software_function" và "other")
  
        và các entity như "date", "reservation", "room","requestForm"  nếu có.
        mẫu Json trả về 
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
                "time": "2025-03-22T08:00:00.000Z",
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
