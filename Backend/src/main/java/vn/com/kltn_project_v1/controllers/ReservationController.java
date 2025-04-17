package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.StatusReservation;
import vn.com.kltn_project_v1.services.IReservation;
import vn.com.kltn_project_v1.util.AESUtil;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/v1/reservation")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {
    @Autowired
    private IReservation reservationService;
    private  SimpMessagingTemplate simpMessagingTemplate;
    // Lưu danh sách phòng đã check-in cùng thời gian hết hạn
    private final ConcurrentHashMap<Long, Date> checkinSessions = new ConcurrentHashMap<>();

    @GetMapping("/getReservationById")
    public ResponseEntity<?> getReservationById(@RequestParam Long reservationId) {
        try {
            return ResponseEntity.ok(reservationService.getReservationById(reservationId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/createReservation")
    public ResponseEntity<?> createReservation(@RequestBody ReservationDTO reservationDTO) {
        try {
            return ResponseEntity.ok(reservationService.createReservation(reservationDTO));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @GetMapping("/getAllReservationByBooker")
    public ResponseEntity<?> getAllReservationByBooker(@RequestParam String phone, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayStart, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayEnd){
        try {
            return ResponseEntity.ok(reservationService.getAllReservationByBooker(phone,dayStart,dayEnd));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/getReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle")
    public ResponseEntity<?> getReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(@RequestParam(required = false) StatusReservation statusReservation, @RequestParam String phone, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayStart, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayEnd, @RequestParam(required = false) String approverName, @RequestParam(required = false) String title){
        try {
            return ResponseEntity.ok(reservationService.getReservationsByStatusReservationAndBookerPhoneAndTimeAndApproverAndTitle(statusReservation,phone,dayStart,dayEnd,approverName,title));
        }catch (Exception e){
            return ResponseEntity.ok(e.toString());
        }
    }

    @GetMapping("/getReservationsByBookerPhone")
    public ResponseEntity<?> getReservationsByBookerPhone(@RequestParam String phone,@RequestParam(required = false) StatusReservation statusReservation){
        try {
            return ResponseEntity.ok(reservationService.getReservationsByBookerPhone(phone,statusReservation));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/checkIn")
    public ResponseEntity<?> checkIn(@RequestBody Map<String, Object> payload) {
        try {
            String encryptedData = payload.get("encryptedData").toString();
            Long employeeId = payload.get("employeeId") instanceof Number ? ((Number) payload.get("employeeId")).longValue() : null;

            // Giải mã dữ liệu từ QR code
            String decryptedData = AESUtil.decrypt(encryptedData);
            Long roomId = Long.parseLong(decryptedData.split("=")[1]);

            // Log dữ liệu để kiểm tra (roomId & timestamp)
            System.out.println("Dữ liệu giải mã: " + decryptedData);
            System.out.println("Người dùng: " + employeeId);

            // Kiểm tra dữ liệu check-in
            String message = reservationService.checkDataCheckIn(roomId, employeeId).get("message").toString();
            Map<String, Object> response = new HashMap<>();
            response.put("message", message);
            response.put("decryptedData", decryptedData);
            Reservation reservation = (Reservation) reservationService.checkDataCheckIn(roomId, employeeId).get("reservation");
            if (reservation != null) {
                Date expireTime = reservation.getTimeEnd();
                checkinSessions.put(reservation.getReservationId(), expireTime);
                response.put("reservationId", reservation.getReservationId());
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi giải mã QR", e);
        }
    }
    // Kiểm tra phòng hết giờ mỗi phút
    @Scheduled(fixedRate = 60000) // Chạy mỗi phút
    public void checkExpiredSessions() {
        Date now = new Date();
        checkinSessions.forEach((reservationId, expiryTime) -> {
            if (now.after(expiryTime)) {
                simpMessagingTemplate.convertAndSend("/topic/room-expired", "Phòng đã hết giờ!");
                reservationService.getReservationById(reservationId).setStatusReservation(StatusReservation.COMPLETED);
                checkinSessions.remove(reservationId);
            }
        });
    }
    @PostMapping("/updateReservation")
    public ResponseEntity<?> updateReservation(@RequestBody ReservationDTO reservationDTO){
        try {
            return ResponseEntity.ok(reservationService.updateReservation(reservationDTO));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/cancelReservation")
    public ResponseEntity<?> cancelReservation(@RequestBody List<Long> reservationIds){
        try {
            return ResponseEntity.ok(reservationService.cancelReservation(reservationIds));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/cancelReservationFrequency")
    public ResponseEntity<?> cancelReservationFrequency(@RequestBody List<Long> reservationIds){
        try {
            return ResponseEntity.ok(reservationService.cancelReservationFrequency(reservationIds));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

}
