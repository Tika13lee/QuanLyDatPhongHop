package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.model.Location;
import vn.com.kltn_project_v1.repositories.LocationRepository;
import vn.com.kltn_project_v1.services.ILocation;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService implements ILocation {
    private final LocationRepository locationRepository;
    @Override
    public List<Location> getAllLocation() {
        return locationRepository.findAll();
    }
}
