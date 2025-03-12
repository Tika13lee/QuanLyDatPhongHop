package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.services.IReservation;

import java.util.Date;

@RestController
@RequestMapping("/api/v1/reservation")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {
    @Autowired
    private IReservation reservationService;
    @GetMapping("/getReservationsByRoomAndDate")
    public ResponseEntity<?> getReservationsByRoomAndDate(@RequestParam Long roomId, @RequestParam Date dayStart, @RequestParam Date dayEnd) {
        try {
            return ResponseEntity.ok(reservationService.getAllReservationInRoom(roomId, dayStart, dayEnd));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
