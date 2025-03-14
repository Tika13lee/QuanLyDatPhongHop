package vn.com.kltn_project_v1.services;

import vn.com.kltn_project_v1.dtos.EmployeeDTO;
import vn.com.kltn_project_v1.model.Employee;

import java.util.List;

public interface IEmployee {
    public Employee createEmployee(EmployeeDTO employeeDTO);
    public Employee upDateEmployee(EmployeeDTO employeeDTO);
    public void deleteEmployee(List<Long> employeeIds);
    public Employee getEmployeeByPhone(String phone);
    public List<Employee> getAllEmployee();
    public List<Employee> getEmployeeByPhoneOrName(String phoneOrName);
    public List<Employee> getEmployeeByDepartmentOrActivedOrBranch(String depName, boolean isActived, String branchName);
}
