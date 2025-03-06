package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.LocationDTO;
import vn.com.kltn_project_v1.model.Location;
import vn.com.kltn_project_v1.services.ILocation;

@RestController
@RequestMapping("/api/v1/location")
public class LocationController {
    @Autowired
    private ILocation locationService;
    @GetMapping("/getAllLocation")
    public ResponseEntity<?> getAllLocation() {
        return ResponseEntity.ok(locationService.getAllLocation());
    }
    @PostMapping("/addLocation")
    public ResponseEntity<?> addLocation(@RequestBody LocationDTO locationDTO) {
        return ResponseEntity.ok(locationService.addLocation(new Location(locationDTO.getBranch(), locationDTO.getBuilding(), locationDTO.getFloor(), locationDTO.getNumber())));
    }
    @PutMapping("/updateLocation")
    public ResponseEntity<?> updateLocation(@RequestBody LocationDTO locationDTO) {
        return ResponseEntity.ok(locationService.updateLocation(new Location(locationDTO.getBranch(), locationDTO.getBuilding(), locationDTO.getFloor(), locationDTO.getNumber())));
    }
    @GetMapping("/getLocationsByRoomIsNull")
    public ResponseEntity<?> getLocationsByRoomIsNull() {
        return ResponseEntity.ok(locationService.findLocationsByRoomIsNull());
    }

}
