package vn.com.kltn_project_v1.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import vn.com.kltn_project_v1.model.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findEmployeeByPhone(String phone);
    @Query("select e from Employee e where e.isActived = true")
    List<Employee> findAll();
    @Query("select e from Employee e where (e.phone like %?1%) or (e.employeeName like %?1%)")
    List<Employee> findEmployeeByPhoneOrName(String phoneOrName);

    @Query("select e from Employee e where (:depName ='' or e.department.depName = :depName) and e.isActived = :isActived and (:branchName ='' or e.department.location.building.branch.branchName = :branchName)")
    List<Employee> findEmployeeByDepartmentOrActivedOrBranch(String depName, boolean isActived, String branchName);
}