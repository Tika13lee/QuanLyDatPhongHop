package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.com.kltn_project_v1.services.IDevice;

@RestController
@RequestMapping("/api/v1/device")
public class DeviceController {
    @Autowired
    private IDevice deviceService;
    @GetMapping("/getAllDevices")
    public ResponseEntity<?> getAllDevices() {
        return ResponseEntity.ok(deviceService.findAll());
    }

}
