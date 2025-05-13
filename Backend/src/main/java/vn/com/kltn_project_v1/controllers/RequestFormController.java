package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.model.Reservation;
import vn.com.kltn_project_v1.model.StatusRequestForm;
import vn.com.kltn_project_v1.model.TypeRequestForm;
import vn.com.kltn_project_v1.services.IRequestForm;

import java.util.ArrayList;
import java.util.Date;
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
    public ResponseEntity<?> getRequestFormByBookerId(@RequestParam Long bookerId, @RequestParam(required = false) StatusRequestForm statusRequestForm, @RequestParam(required = false) TypeRequestForm typeRequestForm, @RequestParam (required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayStart) {
        try {
            return ResponseEntity.ok(requestFormService.getRequestFormByBookerId(bookerId, statusRequestForm,typeRequestForm,dayStart));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @GetMapping("/getRequestFormByApproverId")
    public ResponseEntity<?> getRequestFormByApproverId(@RequestParam Long approverId, @RequestParam(required = false) StatusRequestForm statusRequestForm, @RequestParam(required = false) TypeRequestForm typeRequestForm, @RequestParam (required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayStart, @RequestParam (required = false) Long roomId) {
        try {
            return ResponseEntity.ok(requestFormService.getRequestFormByApproverId(approverId, statusRequestForm,typeRequestForm,dayStart,roomId));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @GetMapping("/getRequestFormByStatus")
    public ResponseEntity<?> getRequestFormByStatusPending(@RequestParam(required = false) StatusRequestForm statusRequestForm, @RequestParam(required = false) TypeRequestForm typeRequestForm, @RequestParam (required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayRequest) {
        try {
            return ResponseEntity.ok(requestFormService.getRequestFormByStatus(statusRequestForm, typeRequestForm, dayRequest));
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
    @PostMapping("/createRequestFormUpdateReservationMany")
    public ResponseEntity<?> createRequestFormUpdateReservationMany(@RequestParam Long requestFormId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date dayFinishFrequencyNew) {
        try {
            return ResponseEntity.ok(requestFormService.createRequestFormUpdateReservationMany(requestFormId, dayFinishFrequencyNew));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @PostMapping("/cancelRequestForm")
    public ResponseEntity<?> cancelRequestForm(@RequestBody List<Long> requestFormIds) {
        try {
            return ResponseEntity.ok(requestFormService.cancelRequestForm(requestFormIds));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
}
