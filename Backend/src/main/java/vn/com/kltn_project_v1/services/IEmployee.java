package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.EmployeeDTO;
import vn.com.kltn_project_v1.model.Employee;

import java.util.List;

public interface IEmployee {
    public Employee createEmployee(EmployeeDTO employeeDTO);
    public Employee upDateEmployee(EmployeeDTO employeeDTO);
    public void deleteEmployee(Long employeeId);
    public Employee getEmployeeByPhone(String phone);
    public List<Employee> getAllEmployee();
}
