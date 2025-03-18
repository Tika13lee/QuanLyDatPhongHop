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
        Employee employee1 = employeeRepository.findEmployeeByPhone(employeeDTO.getPhone()).orElse(null);
        if(employee1 != null){
            return null;
        }
        accountRepository.save(accountRepository.save(new Account(employeeDTO.getPhone(),"1111",false)));
        Employee employee = ConvertToEntity(employeeDTO);

        return employeeRepository.save(employee);
    }

    @Override
    public Employee upDateEmployee(EmployeeDTO employeeDTO) {
        Employee employee1 = employeeRepository.findEmployeeByPhone(employeeDTO.getPhone()).orElse(null);
        if(employee1 != null){
            return null;
        }
        Employee employee = ConvertToEntity(employeeDTO);

        return employeeRepository.save(employee);
    }

    @Override
    public void deleteEmployee(List<Long> employeeIds) {
        for(Long employeeId : employeeIds){
            Employee employee = employeeRepository.findById(employeeId).orElse(null);
            if(employee != null){
                employee.setActived(false);
                employeeRepository.save(employee);
            }
        }
    }

    @Override
    public Employee getEmployeeByPhone(String phone) {
        return employeeRepository.findEmployeeByPhone(phone).orElse(null);
    }

    @Override
    public List<Employee> getAllEmployee() {
        return employeeRepository.findAll();
    }

    @Override
    public List<Employee> getEmployeeByPhoneOrName(String phoneOrName) {
        return employeeRepository.findEmployeeByPhoneOrName(phoneOrName);
    }

    @Override
    public List<Employee> getEmployeeByDepartmentOrActivedOrBranch(String depName, boolean isActived, String branchName) {
        return employeeRepository.findEmployeeByDepartmentOrActivedOrBranch(depName, isActived, branchName);
    }

    Employee ConvertToEntity(EmployeeDTO employeeDTO){
        Employee employee = modelMapper.map(employeeDTO, Employee.class);
        employee.setDepartment(departmentRepository.findById(employeeDTO.getDepartmentId()).orElse(null));
        employee.setActived(true);
        employee.setAccount(accountRepository.findAccountByUserName(employeeDTO.getPhone()).orElse(null));
        employee.getAccount().setRole(employeeDTO.getRole());
        return employee;
    }
}
