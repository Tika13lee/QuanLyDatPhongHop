package vn.com.kltn_project_v1.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.EmployeeDTO;
import vn.com.kltn_project_v1.model.Account;
import vn.com.kltn_project_v1.model.Employee;
import vn.com.kltn_project_v1.repositories.AccountRepository;
import vn.com.kltn_project_v1.repositories.DepartmentRepository;
import vn.com.kltn_project_v1.repositories.EmployeeRepository;
import vn.com.kltn_project_v1.services.IEmployee;

import java.rmi.server.RMIClassLoader;
import java.util.List;

@Service
public class EmployeeService implements IEmployee {
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Override
    public Employee createEmployee(EmployeeDTO employeeDTO) {
        accountRepository.save(accountRepository.save(new Account(employeeDTO.getPhone(),"1111",false)));
        Employee employee = ConvertToEntity(employeeDTO);
        return employeeRepository.save(employee);
    }

    @Override
    public Employee updateEmployee(EmployeeDTO employeeDTO) {
        Employee employee = ConvertToEntity(employeeDTO);
        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        employeeRepository.deleteById(employeeId);
    }

    @Override
    public Employee getEmployeeByPhone(String phone) {
        return employeeRepository.findEmployeeByPhone(phone).orElse(null);
    }

    @Override
    public List<Employee> getAllEmployee() {
        return employeeRepository.findAll();
    }
    Employee ConvertToEntity(EmployeeDTO employeeDTO){
        Employee employee = modelMapper.map(employeeDTO, Employee.class);
        employee.setDepartment(departmentRepository.findById(employeeDTO.getDepartmentId()).orElse(null));
        employee.setActived(true);
        employee.setAccount(accountRepository.findAccountByUserName(employeeDTO.getPhone()).orElse(null));
        return employee;
    }
}
