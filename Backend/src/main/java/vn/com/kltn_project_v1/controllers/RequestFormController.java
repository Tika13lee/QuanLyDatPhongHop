package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.StatusRequestForm;
import vn.com.kltn_project_v1.services.IRequestForm;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/requestForm")
public class RequestFormController {
    @Autowired
    private IRequestForm requestFormService;
    @PostMapping("/createRequestForm")
    public ResponseEntity<?> createRequestForm(@RequestBody RequestFormDTO requestFormDTO) {
        try {
            List<Reservation> reservations = requestFormService.checkDayRequestForm(requestFormDTO);
            if (!reservations.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(reservations);
            }
            return ResponseEntity.ok(requestFormService.createRequestForm(requestFormDTO));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }

    }
    @GetMapping("/getRequestFormById")
    public ResponseEntity<?> getRequestFormById(@RequestParam Long requestFormId) {
        try {
            return ResponseEntity.ok(requestFormService.getRequestFormById(requestFormId));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @GetMapping("/getAllRequestForm")
    public ResponseEntity<?> getAllRequestForm() {
        try {
            return ResponseEntity.ok(requestFormService.getAllRequestForm());
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @PostMapping("/approveRequestForm")
    public ResponseEntity<?> approveRequestForm(@RequestBody List<Long> requestFormIds) {
        try {
            return ResponseEntity.ok(requestFormService.approveRequestForm(requestFormIds));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @PostMapping("/rejectRequestForm")
    public ResponseEntity<?> rejectRequestForm(@RequestBody List<Long> requestFormIds, @RequestParam String reasonReject) {
        try {
            return ResponseEntity.ok(requestFormService.rejectRequestForm(requestFormIds, reasonReject));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @GetMapping("/getRequestFormByBookerId")
    public ResponseEntity<?> getRequestFormByBookerId(@RequestParam Long bookerId, @RequestParam(required = false) StatusRequestForm statusRequestForm) {
        try {
            return ResponseEntity.ok(requestFormService.getRequestFormByBookerId(bookerId, statusRequestForm));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @GetMapping("/getRequestFormByApproverId")
    public ResponseEntity<?> getRequestFormByApproverId(@RequestParam Long approverId, @RequestParam(required = false) StatusRequestForm statusRequestForm) {
        try {
            return ResponseEntity.ok(requestFormService.getRequestFormByApproverId(approverId, statusRequestForm));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @GetMapping("/getRequestFormByStatus")
    public ResponseEntity<?> getRequestFormByStatusPending(@RequestParam(required = false) StatusRequestForm statusRequestForm) {
        try {
            return ResponseEntity.ok(requestFormService.getRequestFormByStatus(statusRequestForm));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @PostMapping("/createRequestFormUpdateReservationOne")
    public ResponseEntity<?> createRequestFormUpdateReservationOne(@RequestBody RequestFormDTO requestFormDTO) {
        try {
            return ResponseEntity.ok(requestFormService.createRequestFormUpdateReservationOne(requestFormDTO));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
}
