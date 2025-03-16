package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.ReservationDTO;
import vn.com.kltn_project_v1.model.StatusReservation;
import vn.com.kltn_project_v1.services.IReservation;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reservation")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {
    @Autowired
    private IReservation reservationService;
    @GetMapping("/getReservationsPending")
    public ResponseEntity<?> getReservationsPending(@RequestParam(defaultValue = "0") Long approverId) {
        try {
            return ResponseEntity.ok(reservationService.getAllReservationPending(approverId));
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
    @PutMapping("/approveReservation")
    public ResponseEntity<?> approveReservation(@RequestBody List<Long> reservationIds){
        try {
            return ResponseEntity.ok(reservationService.approveReservation(reservationIds));
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
    @PutMapping("/disApproveReservation")
    public ResponseEntity<?> disApproveReservation(@RequestBody List<Long> reservationIds){
        try {
            return ResponseEntity.ok(reservationService.disApproveReservation(reservationIds));
        }catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/getReservationsNoPending")
    public ResponseEntity<?> getReservationsNoPending(@RequestParam(defaultValue = "0") Long approverId) {
        try {
            return ResponseEntity.ok(reservationService.getAllReservationNoPending(approverId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/getReservationsNoApproved")
    public ResponseEntity<?> getReservationsNoApproved(@RequestParam(defaultValue = "0") Long approverId) {
        try {
            return ResponseEntity.ok(reservationService.getAllReservationNoApproved(approverId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
