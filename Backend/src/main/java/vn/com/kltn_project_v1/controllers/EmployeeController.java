package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.EmployeeDTO;
import vn.com.kltn_project_v1.model.Employee;
import vn.com.kltn_project_v1.services.IEmployee;

import java.util.List;

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
        Employee employee = employeeService.createEmployee(employeeDTO);
        if (employee == null) {
            return ResponseEntity.badRequest().body("Đã có nhân viên có số điện thoại này");
        }
        return ResponseEntity.ok().build();

    }
    @PutMapping("/upDateEmployee")
    public ResponseEntity<?> upDateEmployee(@RequestBody EmployeeDTO employeeDTO) {
        Employee employee = employeeService.createEmployee(employeeDTO);
        if (employee == null) {
            return ResponseEntity.badRequest().body("Đã có nhân viên có số điện thoại này");
        }
        return ResponseEntity.ok().build();
    }
    @PutMapping("/nonActiveEmployee")
    public ResponseEntity<?> deleteEmployee(@RequestBody List<Long> employeeIds) {
        employeeService.deleteEmployee(employeeIds);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/getEmployeeByPhone")
    public ResponseEntity<?> getEmployeeByPhone(@RequestParam String phone) {
        return ResponseEntity.ok(employeeService.getEmployeeByPhone(phone));
    }
    @GetMapping("/getEmployeeByPhoneOrName")
    public ResponseEntity<?> getEmployeeByPhoneOrName(@RequestParam String phoneOrName) {
        return ResponseEntity.ok(employeeService.getEmployeeByPhoneOrName(phoneOrName));
    }
    @GetMapping("/getEmployeeByDepartmentOrActivedOrBranch")
    public ResponseEntity<?> getEmployeeByDepartmentOrActivedOrBranch(@RequestParam(defaultValue = "") String depName, @RequestParam(defaultValue = "true") boolean isActived, @RequestParam(defaultValue = "") String branchName) {
        return ResponseEntity.ok(employeeService.getEmployeeByDepartmentOrActivedOrBranch(depName, isActived, branchName));
    }
}
