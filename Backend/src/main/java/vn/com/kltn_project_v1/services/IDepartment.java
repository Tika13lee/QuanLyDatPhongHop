package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.DepartmentDTO;
import vn.com.kltn_project_v1.model.Department;

import java.util.List;

public interface IDepartment {
    Department createDepartment(DepartmentDTO departmentDTO);
    Department updateDepartment(DepartmentDTO departmentDTO);
    void deleteDepartment(Long departmentId);
    List<Department> getAllDepartment();
}
