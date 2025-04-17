package vn.com.kltn_project_v1.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.com.kltn_project_v1.dtos.EmployeeDTO;
import vn.com.kltn_project_v1.model.Account;
import vn.com.kltn_project_v1.model.Employee;
import vn.com.kltn_project_v1.model.Role;
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
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public Employee createEmployee(EmployeeDTO employeeDTO) {
        Employee employee1 = employeeRepository.findEmployeeByPhone(employeeDTO.getPhone()).orElse(null);
        if(employee1 != null){
            return null;
        }
        String encodedPassword = passwordEncoder.encode("1111");
        accountRepository.save(accountRepository.save(new Account(employeeDTO.getPhone(),encodedPassword,employeeDTO.getRole())));
        Employee employee = ConvertToEntity(employeeDTO);

        return employeeRepository.save(employee);
    }

    @Override
    public Employee upDateEmployee(EmployeeDTO employeeDTO) {
        Employee employee1 = employeeRepository.findEmployeeByPhone(employeeDTO.getPhone()).orElse(null);
        Employee employee2 = employeeRepository.findById(employeeDTO.getEmployeeId()).orElse(null);
        if(employee1 != null) {
            assert employee2 != null;
            System.out.println(employee1.getEmployeeId() + " " + employee2.getEmployeeId()  );
            if (employee1.getEmployeeId() != employee2.getEmployeeId()) {
                return null;
            }
        }
        employee2.getAccount().setUserName(employeeDTO.getPhone());
        employeeRepository.save(employee2);
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

    @Override
    public List<Employee> getEmployeeByRole(String roleName) {
        Role role = Role.valueOf(roleName);
        return employeeRepository.findEmployeesByAccount_Role(role);
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
