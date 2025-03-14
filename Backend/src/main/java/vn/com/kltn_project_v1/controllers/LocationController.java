package vn.com.kltn_project_v1.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.com.kltn_project_v1.dtos.LocationDTO;
import vn.com.kltn_project_v1.model.Location;
import vn.com.kltn_project_v1.services.ILocation;

@RestController
@RequestMapping("/api/v1/location")
@CrossOrigin(origins = "http://localhost:3000")
public class LocationController {
    @Autowired
    private ILocation locationService;
    @GetMapping("/getAllLocation")
    public ResponseEntity<?> getAllLocation() {
        return ResponseEntity.ok(locationService.getAllLocation());
    }
    @PostMapping("/addLocation")
    public ResponseEntity<?> addLocation(@RequestParam Long buildingId, @RequestParam String floor) {
        return ResponseEntity.ok(locationService.addLocation(buildingId, floor));
    }

    @GetMapping("/getAllBranch")
    public ResponseEntity<?> getAllBranch() {
        return ResponseEntity.ok(locationService.getAllBranch());
    }
    @GetMapping("/getAllBuilding")
    public ResponseEntity<?> getAllBuilding() {
        return ResponseEntity.ok(locationService.getAllBuilding());
    }
    @GetMapping("/getLocationsByBuildingName")
    public ResponseEntity<?> getLocationsByBuildingName(@RequestParam String buildingName) {
        return ResponseEntity.ok(locationService.getLocationsByBuildingName(buildingName));
    }
    @GetMapping("/getBuildingsByBranchName")
    public ResponseEntity<?> getBuildingsByBranchName(@RequestParam String branchName) {
        return ResponseEntity.ok(locationService.getBuildingsByBranchName(branchName));
    }
    @GetMapping("/getLocationsByBuildingId")
    public ResponseEntity<?> getLocationsByBuildingId(@RequestParam Long buildingId) {
        return ResponseEntity.ok(locationService.getLocationsByBuildingId(buildingId));
    }
    @GetMapping("/getLocationsByBranchName")
    public ResponseEntity<?> getLocationsByBranchName(@RequestParam String branchName) {
        return ResponseEntity.ok(locationService.getLocationsByBranchName(branchName));
    }

}
