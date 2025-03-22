package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.com.kltn_project_v1.model.Department;

import java.util.List;
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    @Query("SELECT d FROM Department d WHERE d.location.building.branch.branchName = ?1")
    List<Department> findDepartmentsByBranchName(String branchName);
}