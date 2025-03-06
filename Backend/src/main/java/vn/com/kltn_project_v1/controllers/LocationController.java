package vn.com.kltn_project_v1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
