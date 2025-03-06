package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.com.kltn_project_v1.model.Location;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findLocationByBranchAndBuildingAndFloorAndNumber (String branch, String building, String floor, String number);
}