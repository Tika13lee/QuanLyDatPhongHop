package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.EmployeeDTO;
import vn.com.kltn_project_v1.services.IEmployee;

@RestController
@RequestMapping("/api/v1/employee")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {
    @Autowired
    private IEmployee employeeService;
    @GetMapping("/getAllEmployee")
    public ResponseEntity<?> getAllEmployee() {
        return ResponseEntity.ok(employeeService.getAllEmployee());
    }
    @PostMapping("/addEmployee")
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.createEmployee(employeeDTO));
    }
    @PutMapping("/upDateEmployee")
    public ResponseEntity<?> upDateEmployee(@RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.upDateEmployee(employeeDTO));
    }
    @DeleteMapping("/deleteEmployee")
    public ResponseEntity<?> deleteEmployee(@RequestParam Long employeeId) {
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/getEmployeeByPhone")
    public ResponseEntity<?> getEmployeeByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(employeeService.getEmployeeByPhone(phone));
    }
}
