package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
    public ResponseEntity<?> getReservationsByRoomAndDate(@RequestParam Long roomId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayStart, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayEnd) {
        try {
            System.out.println("roomId: " + roomId+ " dayStart: " + dayStart + " dayEnd: " + dayEnd);
            return ResponseEntity.ok(reservationService.getAllReservationInRoom(roomId, dayStart, dayEnd));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/getReservationsPending")
    public ResponseEntity<?> getReservationsPending() {
        try {
            return ResponseEntity.ok(reservationService.getAllReservationPending());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/getReservationsWaitingCancel")
    public ResponseEntity<?> getReservationsWaitingCancel() {
        try {
            return ResponseEntity.ok(reservationService.getAllReservationWaitingCancel());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
