package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.com.kltn_project_v1.model.Location;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findLocationsByRoomIsNull() ;
    List<Location> findLocationsByBuilding_BuildingId(Long buildingId);
    List<Location> findLocationsByBuildingBranchBranchName(String branchName);
    List<Location> findLocationsByBuilding_BuildingName(String buildingName);
}