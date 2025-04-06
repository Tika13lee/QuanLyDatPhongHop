package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.services.INotification;

@RestController
@RequestMapping("/api/v1/notification")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    @Autowired
    private INotification notificationService;
    @GetMapping("/getAllNotification")
    public ResponseEntity<?> getAllNotification(@RequestParam Long employeeId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(employeeId));
    }
    @PostMapping("/markAllAsRead")
    public ResponseEntity<?> markAllAsRead(@RequestParam Long employeeId) {
        return ResponseEntity.ok(notificationService.markAllAsRead(employeeId));
    }
}
