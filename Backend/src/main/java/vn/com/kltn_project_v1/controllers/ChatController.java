package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.services.IOpenAi;

import java.util.Map;

@RestController
@RequestMapping("api/v1/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private IOpenAi openAiService;

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String aiResponse = openAiService.extractIntentAndEntities(message);
        System.out.println("AI Response: " + aiResponse);
        // Parse JSON → lấy intent + entities → gọi API đặt phòng của bạn
        // (bạn có thể dùng Jackson để parse)

        return ResponseEntity.ok(Map.of("reply", aiResponse));
    }
}
