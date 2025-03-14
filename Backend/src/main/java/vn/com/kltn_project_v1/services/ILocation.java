package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.LocationDTO;
import vn.com.kltn_project_v1.model.Branch;
import vn.com.kltn_project_v1.model.Building;
import vn.com.kltn_project_v1.model.Location;

import java.util.List;

public interface ILocation {
    public List<LocationDTO> getAllLocation();
    public Location addLocation(Long buildingId, String floor);
    public List<LocationDTO> findLocationsByRoomIsNull();
    public void DeleteLocation(Location location);
    public List<Branch> getAllBranch();
    public Branch addBranch(String branchName);
    public Building addBuilding(String buildingName, Long branchId);
    public List<Building> getAllBuilding();
    public List<LocationDTO> getLocationsByBuildingName(String buildingName);
    public List<Building> getBuildingsByBranchName(String branchName);
    public List<LocationDTO> getLocationsByBuildingId(Long buildingId);
    public List<LocationDTO> getLocationsByBranchName(String branchName);

}
