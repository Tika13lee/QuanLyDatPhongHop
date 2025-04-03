package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.ServiceDTO;
import vn.com.kltn_project_v1.services.IService;

@RestController
@RequestMapping("/api/v1/service")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceController {
    @Autowired
    private IService serviceService;
    @GetMapping("/getAllServices")
    public ResponseEntity<?> getAllServices() {
        return ResponseEntity.ok(serviceService.findAll());
    }
    @PostMapping("/addService")
    public ResponseEntity<?> addService(@RequestBody ServiceDTO serviceDTO) {
        return ResponseEntity.ok(serviceService.createService(serviceDTO));
    }
    @PutMapping("/upDateService")
    public ResponseEntity<?> upDateService(@RequestBody ServiceDTO serviceDTO) {
        return ResponseEntity.ok(serviceService.upDateService(serviceDTO));
    }
    @DeleteMapping("/deleteService")
    public ResponseEntity<?> deleteService(@RequestBody ServiceDTO serviceDTO) {
        serviceService.deleteService(serviceDTO.getServiceId());
        return ResponseEntity.ok().build();
    }
    @GetMapping("/getServiceByName")
    public ResponseEntity<?> getServiceByName(@RequestParam String name) {
        return ResponseEntity.ok(serviceService.getServiceByName(name));
    }
    @GetMapping("/getServiceById")
    public ResponseEntity<?> getServiceById(@RequestParam Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }
}
