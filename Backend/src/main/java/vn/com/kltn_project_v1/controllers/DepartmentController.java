package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.DepartmentDTO;
import vn.com.kltn_project_v1.services.IDepartment;

@RestController
@RequestMapping("/api/v1/department")
@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentController {
    @Autowired
    private IDepartment departmentService;
    @GetMapping("/getAllDepartments")
    public ResponseEntity<?> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartment());
    }
    @PostMapping("/addDepartment")
    public ResponseEntity<?> addDepartment(@RequestBody DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(departmentService.createDepartment(departmentDTO));
    }
    @PutMapping("/upDateDepartment")
    public ResponseEntity<?> upDateDepartment(@RequestBody DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(departmentService.upDateDepartment(departmentDTO));
    }
    @DeleteMapping("/deleteDepartment")
    public ResponseEntity<?> deleteDepartment(@RequestParam Long departmentId) {
        departmentService.deleteDepartment(departmentId);
        return ResponseEntity.ok().build();
    }
}
