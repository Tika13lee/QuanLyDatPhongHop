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
    @GetMapping("/getReservationById")
    public ResponseEntity<?> getReservationById(@RequestParam Long reservationId) {
        try {
            return ResponseEntity.ok(reservationService.getReservationById(reservationId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
