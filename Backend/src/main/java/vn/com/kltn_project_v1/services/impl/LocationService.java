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

    @Override
    public Location findLocation(String branch, String building, String floor, String number) {
        return locationRepository.findLocationByBranchAndBuildingAndFloorAndNumber(branch, building, floor, number)
                .orElseThrow(()->new RuntimeException("Location not found"));
    }

    @Override
    public Location addLocation(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public Location updateLocation(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public List<Location> findLocationsByRoomIsNull() {
        return locationRepository.findLocationsByRoomIsNull();
    }

    @Override
    public void DeleteLocation(Location location) {
         locationRepository.delete(location);
    }
}
