package vn.com.kltn_project_v1.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.DeviceDTO;
import vn.com.kltn_project_v1.model.Device;
import vn.com.kltn_project_v1.services.IDevice;

@RestController
@RequestMapping("/api/v1/device")
@CrossOrigin(origins = "http://localhost:3000")
public class DeviceController {
    @Autowired
    private IDevice deviceService;
    @GetMapping("/getAllDevices")
    public ResponseEntity<?> getAllDevices() {
        return ResponseEntity.ok(deviceService.findAll());
    }
    @PostMapping("/addDevice")
    public ResponseEntity<?> addDevice(@RequestBody DeviceDTO deviceDTO) {
        return ResponseEntity.ok(deviceService.createDevice(deviceDTO));
    }
    @PutMapping("/upDateDevice")
    public ResponseEntity<?> upDateDevice(@RequestBody DeviceDTO deviceDTO) {
        return ResponseEntity.ok(deviceService.upDateDevice(deviceDTO));
    }
    @DeleteMapping("/deleteDevice")
    public ResponseEntity<?> deleteDevice(@RequestBody DeviceDTO deviceDTO) {
        deviceService.deleteDevice(deviceDTO.getDeviceId());
        return ResponseEntity.ok().build();
    }
    @GetMapping("/getDeviceByName")
    public ResponseEntity<?> getDeviceByName(@RequestParam String name) {
        return ResponseEntity.ok(deviceService.getDeviceByName(name));
    }
}
