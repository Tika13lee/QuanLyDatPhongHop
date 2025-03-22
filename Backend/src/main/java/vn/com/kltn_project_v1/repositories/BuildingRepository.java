package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Building;

import java.util.List;
@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    List<Building> findBuildingsByBranch_BranchName(String branchName);

}