package vn.com.kltn_project_v1.services.impl;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.LocationDTO;
import vn.com.kltn_project_v1.model.Branch;
import vn.com.kltn_project_v1.model.Building;
import vn.com.kltn_project_v1.model.Location;
import vn.com.kltn_project_v1.repositories.BranchRepository;
import vn.com.kltn_project_v1.repositories.BuildingRepository;
import vn.com.kltn_project_v1.repositories.LocationRepository;
import vn.com.kltn_project_v1.services.ILocation;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService implements ILocation {
    private final LocationRepository locationRepository;
    private final BuildingRepository buildingRepository;
    private final BranchRepository branchRepository;
    private final ModelMapper modelMapper;
    @Override
    public List<LocationDTO> getAllLocation() {
        return  locationRepository.findAll().stream().map(this::convertLocationToDTO).collect(Collectors.toList());
    }

    @Override
    public Location addLocation(Long buildingId, String floor) {
        Location location = new Location();
        location.setBuilding(buildingRepository.findById(buildingId).orElseThrow(()->new RuntimeException("Building not found")));
        location.setFloor(floor);
        return locationRepository.save(location);
    }

    @Override
    public List<LocationDTO> findLocationsByRoomIsNull() {
        return locationRepository.findLocationsByRoomIsNull().stream().map(this::convertLocationToDTO).collect(Collectors.toList());
    }

    @Override
    public void DeleteLocation(Location location) {
         locationRepository.delete(location);
    }

    @Override
    public List<Branch> getAllBranch() {
        return branchRepository.findAll();
    }

    @Override
    public Branch addBranch(String branchName) {
        Branch branch = new Branch();
        branch.setBranchName(branchName);
        return branchRepository.save(branch);
    }

    @Override
    public Building addBuilding(String buildingName, Long branchId) {
        Building building = new Building();
        building.setBuildingName(buildingName);
        building.setBranch(branchRepository.findById(branchId).orElseThrow(()->new RuntimeException("Branch not found")));
        return buildingRepository.save(building);
    }

    @Override
    public List<Building> getAllBuilding() {
        return buildingRepository.findAll();
    }

    @Override
    public List<LocationDTO> getLocationsByBuildingName(String buildingName) {
        return locationRepository.findLocationsByBuilding_BuildingName(buildingName).stream().map(this::convertLocationToDTO).collect(Collectors.toList());
    }

    @Override
    public List<Building> getBuildingsByBranchName(String branchName) {
        return buildingRepository.findBuildingsByBranch_BranchName(branchName);
    }

    @Override
    public List<LocationDTO> getLocationsByBuildingId(Long buildingId) {
        return locationRepository.findLocationsByBuilding_BuildingId(buildingId).stream().map(this::convertLocationToDTO).collect(Collectors.toList());
    }

    @Override
    public List<LocationDTO> getLocationsByBranchName(String branchName) {
        return locationRepository.findLocationsByBuildingBranchBranchName(branchName).stream().map(this::convertLocationToDTO).collect(Collectors.toList());
    }

    public LocationDTO convertLocationToDTO(Location location){
        LocationDTO locationDTO = modelMapper.map(location, LocationDTO.class);

        locationDTO.setBuilding(location.getBuilding().getBuildingName());
        locationDTO.setBranch(location.getBuilding().getBranch().getBranchName());
        return locationDTO;
    }

}
