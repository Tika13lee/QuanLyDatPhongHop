package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.RequestFormDTO;
import vn.com.kltn_project_v1.model.StatusRequestForm;
import vn.com.kltn_project_v1.services.IRequestForm;

@RestController
@RequestMapping("/api/v1/requestForm")
public class RequestFormController {
    @Autowired
    private IRequestForm requestFormService;
    @PostMapping("/createRequestForm")
    public ResponseEntity<?> createRequestForm(@RequestBody RequestFormDTO requestFormDTO) {
        try {
            System.out.println("1");
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
    public ResponseEntity<?> approveRequestForm(@RequestParam Long requestFormId) {
        try {
            return ResponseEntity.ok(requestFormService.approveRequestForm(requestFormId));
        } catch (Exception e) {
            return ResponseEntity.ok(e.toString());
        }
    }
    @PostMapping("/rejectRequestForm")
    public ResponseEntity<?> rejectRequestForm(@RequestParam Long requestFormId, @RequestParam String reasonReject) {
        try {
            return ResponseEntity.ok(requestFormService.rejectRequestForm(requestFormId, reasonReject));
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
}
